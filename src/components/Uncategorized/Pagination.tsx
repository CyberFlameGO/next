import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  isNextPage: boolean;
  skip: number;
  nextPage: () => void;
  prevPage: () => void;
  isTop?: boolean;
}

const Pagination: FC<IProps> = (props) => {
  const { isNextPage, skip, isTop, nextPage, prevPage } = props;

  return (
    <div className={`flex justify-end space-x-4 ${isTop ? 'mb-4' : 'mt-4'}`}>
      {skip !== 0 && (
        <button type={'button'} className={'focus:outline-none bg-gray-700 hover:opacity-70 px-4 py-1 font-semibold uppercase text-sm rounded text-white text-center transition ease-in-out duration-300'} onClick={prevPage}>
          <FontAwesomeIcon icon={faAngleLeft} /> Back
        </button>
      )}
      {isNextPage && skip < 500 && (
        <button type={'button'} className={'focus:outline-none bg-gray-700 hover:opacity-70 px-4 py-1 font-semibold uppercase text-sm rounded text-white text-center transition ease-in-out duration-300'} onClick={nextPage}>
          Next <FontAwesomeIcon icon={faAngleRight} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
