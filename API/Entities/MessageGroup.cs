using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class MessageGroup
    {
        public MessageGroup()
        {
        }
        public MessageGroup(string name)
        {
            Name = name;
        }

        [Key]
        public string Name { get; set; }
        public ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }
}