import { Pagination } from 'react-bootstrap';
import usePaginationControls from '../hooks/component-hooks/usePaginationControls.js';

export default function PaginationControls({ currentPage, totalPages }) {
  const { pageNums, changePage } = usePaginationControls(totalPages);

  return (
    <div className="my-5 small">
      <Pagination className="justify-content-center align-items-center gap-2 mb-2 mt-3">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => changePage(1)}
          className="custom-disable"
        >
          first
        </Pagination.First>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
          className="custom-disable"
        >
          prev
        </Pagination.Prev>
        {pageNums.map((num) => (
          <Pagination.Item
            key={num}
            active={num === currentPage}
            className={'custom-z-0 ' + (num === currentPage ? 'active' : '')}
            onClick={() => changePage(num)}
          >
            {num}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
          className="custom-disable"
        >
          next
        </Pagination.Next>
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => changePage(totalPages)}
          className="custom-disable"
        >
          last
        </Pagination.Last>
      </Pagination>

      <div className="text-center small text-muted">
        {currentPage}/{totalPages}
      </div>
    </div>
  );
}
