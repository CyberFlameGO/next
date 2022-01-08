import {SocketMatchPlayerData} from "../../../types.client.socket";
import PlayerCard from "../../../components/Player/PlayerCard";
import PlayerProgress from "./PlayerProgress";
import useConfig from "../../../hooks/useConfig";
import PlayerPlacement from "./PlayerPlacement";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface IProps {
    participantsData: SocketMatchPlayerData[];
    firstWord?: string;
    modeId: number;
    roundLimit: number;
    isFinished: boolean;
}

const PlayerRacetrack = (props: IProps) => {

    const { participantsData, firstWord, roundLimit } = props;
    const { hideWPM, useCPM } = useConfig();

    return (
        <div className={`grid grid-cols-1 gap-2 mt-5`}>
            {participantsData.map((item) => item.teamId !== 0 && (
                <div key={item.playerId} className={"flex bg-gray-750 bg-opacity-50 rounded-xl shadow-md"}>
                    <div className="w-96">
                        <PlayerCard
                            className={`px-4 py-2 rounded-l-lg rounded-t-lg`}
                            cardBorder={item.cardBorder}
                            cardImage={item.cardImage}
                            name={item.name}
                            discriminator={item.discriminator}
                            avatarSrc={item.avatarSrc}
                            verified={item.verified}
                            patreon={item.patreon}
                            staff={item.staff}
                            isLeaderboard
                            useTransparent
                        />
                    </div>

                    <div className="w-128 my-auto mx-auto relative mt-6 border-b-2 border-gray-825">
                        <div className="absolute inline w-auto text-xs text-center text-white font-semibold -mt-3 transition-all ease-in-out duration-300" style={{ left: item.Progress ? `${item.Progress}%` : '0' }}>
                            <div className="block mb-1 bg-gray-750 border border-gray-700 px-4 py-1 rounded-lg">
                                {item.Quit === 1 && item.Progress !== 100 ? 'Quit' : item.currentWord || firstWord}
                            </div>
                        </div>
                    </div>

                    <div className="w-40" />

                    <div className="w-24 my-auto font-semibold text-white">
                        {hideWPM === '0' && (
                            <>
                                {(item?.Progress || 0).toFixed(0)}
                                <span className="font-bold">%</span>
                            </>
                        )}
                    </div>

                    <div className="w-32 my-auto font-semibold text-white">
                        {hideWPM === '0' && (
                            <>
                                {(item?.WPM || 0).toFixed(2)}
                                <span className="font-bold"> {useCPM === '1' ? 'CPM' : 'WPM'}</span>
                            </>
                        )}
                    </div>

                    <div className={`${roundLimit >= 1 ? 'w-20' : 'w-8'} my-auto`}>
                        {roundLimit >= 1 ? (
                            <div className={"flex justify-center gap-4 text-xs md:text-sm pt-2"}>
                                {[...Array(roundLimit)].map((_circle, index) => (index < (item.roundsWon ? item.roundsWon : 0))
                                    ? <FontAwesomeIcon icon={faCircle} className={"text-orange-400"} />
                                    : <FontAwesomeIcon icon={faCircle} className={"text-gray-600"} />
                                )}
                            </div>
                        ) : (
                            <>
                                {(item.Progress === 100 && item.Placement !== 0) && <PlayerPlacement placement={item.Placement} placementFinal={item.PlacementFinal} />}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PlayerRacetrack;