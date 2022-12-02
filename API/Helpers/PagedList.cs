using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    // works with any type of object or class which is a generic type
    public class PagedList<T> : List<T>
    {
        // when create a new instance of the pagedlist we get all these properties
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize); // page size of 4 will represent 3 pages
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pagenumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pagenumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedList<T>(items, count, pagenumber, pageSize);
        }
    }
}