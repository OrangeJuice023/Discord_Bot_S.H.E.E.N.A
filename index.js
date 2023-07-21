const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require("./server")

const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client()

const sadWords = 
["sad", "depressed", "unhappy", "angry", "miserable", "gago", "gago ka", "tangina", "fuck", "shit", "pota", "ano bayan", "Sad", "Shit", "ayoko na", "tangina mo", "mukha kang gago", "Amputa", "Sad", "Depressed", "Unhappy", "Angry", "Miserable", "Gago", "Gago ka", "Tangina", "Tang ina", "Tang ina mo", "Tanginamo", "potanginamo", "Potanginamo", "Ayokona", "ayokona", "gagoka", "Gago", "fucku", "./.", "pakyu", "Pakyu", "amputa", "Ampota", "tarantado", "Ulol", "ULOL", "sadreacts", "grabe na talaga", "lungkot", "Nakakainis", "inis", "kainis", "Kainis", "Taena", "taena", "tangina niyo", "ansakit", "Masakit", "Masaket", "Tangina niyo", "putangina", "POTAENA", "potaena", "potangina" ]


const starterEncouragements = [
  "Cheer up!",
  "Hang in there.",
  " We will get through this quarter, I promise.",
  "There is always someone who loves you.",
  "You are a great person"
]

db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }  
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }  

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
}

function deleteEncouragment(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
  })
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === "Sinspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }
  
db.get("responding").then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
      })
    }
  })

  if (msg.content.startsWith("Snew")) {
    encouragingMessage = msg.content.split("Snew ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if (msg.content.startsWith("Sdel")) {
    index = parseInt(msg.content.split("Sdel ")[1])
    deleteEncouragment(index)
    msg.channel.send("Encouraging message deleted.")
  }

  if (msg.content.startsWith("Slist")) {
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }
    
  if (msg.content.startsWith("Sresponding")) {
    value = msg.content.split("Sresponding ")[1]

    if (value.toLowerCase() == "on") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
      db.set("responding", false)
      msg.channel.send("Responding is off.")
    }
  }
})
})

keepAlive()
client.login(process.env.TOKEN)