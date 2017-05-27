// this files does absolutly nothing and should be concidered as extra documentation
// I basicly wanted to type out my redis database structure, I have it on a piece of paper and
// Since I and only I have that paper I think its stupid not to put it somewhere where people can see it
// so that if they want to contrubute they can get an idea of whats going on...WHATS GOING on... AYYYYYAYYAYYAYAYAYAYAYAyayaya - Marvin Gaye

// to explain how I will go about this, I will write the key and what is suposed to be in the key as a string
// sets will be arrays...and Hashes will be objects, Also important {id} represents the unique server id
{
  "{id}:server": {
    id: "Server Id, I know it makes no sense since the key has the id but you know...life...reasons...stuff..",
    isOn: "This is a bool that lets us know if the user turned the bot on, on the website",
    name: "the server name",
    icon: "server icon for website"
  },
  "{id}:mods":['music'],
}
