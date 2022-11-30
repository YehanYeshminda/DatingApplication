using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
          // from to where and if the is main then set the photourl as the url
          CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.PhotoUrl, opt => 
              opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.Age, opt => 
              opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

          CreateMap<Photo, PhotoDto>();
          CreateMap<MemberUpdateDto, AppUser>(); // mapping the member dto to the appuser properties
          CreateMap<RegisterDto, AppUser>(); // mapping the register dto to the app user
        }


    }
}