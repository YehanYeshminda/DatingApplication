using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessageController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessageController(IUserRepository userRepository, IMessageRepository messageRepository,IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto) 
        {
            var username = User.GetUsername();

            if (username == createMessageDto.RecipientUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipinet = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipinet == null) return NotFound();

            var message = new Message
            {
                Sender = sender, // we can pass in the id or the app user object into these properties
                Recipient = recipinet,
                SenderUsername = sender.UserName,
                RecipientUsername = recipinet.UserName,
                content = createMessageDto.Content,
            };

            _messageRepository.AddMessage(message);

            // map to the mapper dto
            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message!");
        }
    }
}