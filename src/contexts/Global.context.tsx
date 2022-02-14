import {FC, useState, createContext, useContext, useEffect, useRef, useCallback} from 'react';
import axios, { CancelTokenSource } from "axios";
import Config from "../Config";
import { AchievementData, ChallengeData, ItemData } from '../types.client.mongo';

interface GlobalAnnouncement {
    key: string;
    value: string;
    url?: string;
}

interface ContextType {
    announcement: GlobalAnnouncement
    playercards: ItemData[];
    banners: ItemData[];
    borders: ItemData[];
    challenges: ChallengeData[];
    achievements: AchievementData[];
    countries: { name: string, code: string }[];
    keyboards: { id: number, name: string }[];
    worlds: { id: number, name: string }[];
    locales: { name: string, locale: string }[];
}

export const GlobalContext = createContext<ContextType | null>(null);

export const GlobalProvider: FC = ({ children }) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);

    const [ announcement, setAnnouncement ] = useState<GlobalAnnouncement>({
        key: "",
        value: "",
        url: "",
    });
    const [ playercards, setPlayercards ] = useState<ItemData[]>([]);
    const [ borders, setBorders ] = useState<ItemData[]>([]);
    const [ banners, setBanners ] = useState<ItemData[]>([]);
    const [ challenges, setChallenges ] = useState<ChallengeData[]>([]);
    const [ achievements, setAchievements ] = useState<AchievementData[]>([]);
    const [ countries, setCountries ] = useState<{ name: string, code: string }[]>([]);
    const [ keyboards, setKeyboards ] = useState<{ id: number, name: string }[]>([]);
    const [ locales, setLocales ] = useState<{ name: string, locale: string }[]>([]);
    const [ worlds, setWorlds ] = useState<{ id: number, name: string }[]>([]);

    const getGlobalData = useCallback(async (key: string) => {
        const response = await axios.get(`${Config.gameUrl}/globals?key=${key}`, {
            withCredentials: true,
            cancelToken: axiosCancelSource.current?.token,
        });
        const data = await response.data;
        return data ? data : null;
    }, []);

    const getGameData = useCallback(async () => {
        const response = await axios.get(`${Config.gameUrl}/all`, {
            withCredentials: true,
            cancelToken: axiosCancelSource.current?.token,
        });
        const data = await response.data;
        return data ? data : null;
    }, []);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getGlobalData("announcement")
            .then((r) => setAnnouncement((announcement) => r || announcement))
            .catch((e) => console.log(e));

        getGameData()
            .then((r) => {
                setPlayercards(r.playercards || []);
                setBorders(r.borders || []);
                setBanners(r.banners || []);
                setChallenges(r.challenges || []);
                setAchievements(r.achievements || []);
                setCountries(r.countries || []);
                setKeyboards(r.keyboards || []);
                setLocales(r.locales || []);
                setWorlds(r.worlds || []);
            }).catch((e) => console.log(e));

        return () => axiosCancelSource.current?.cancel();
    }, [ getGlobalData ]);

    return <GlobalContext.Provider value={{ announcement, playercards, borders, banners, challenges, achievements, locales, worlds, keyboards, countries }}>
        {children}
    </GlobalContext.Provider>;
}

export const useGlobalContext = (): ContextType => {
    const context = useContext(GlobalContext);

    if (context == null) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
}
