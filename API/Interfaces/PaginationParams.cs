namespace API.Interfaces
{
    public class PaginationParams
    {
        private const int maxPageSize = 50; // maximum items per page
        public int PageNumber { get; set; } = 1; // will always return the 1st page
        private int _pageSize = 10; // the intial page size is to 10
        public int PageSize
        {
            get => _pageSize; // 10

            // if value is greater than the max page size then we return 50
            set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
        }
    }
}