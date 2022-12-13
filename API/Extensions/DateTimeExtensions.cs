namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        // this method will calculate the age of a person
        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;

            if(dob.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}