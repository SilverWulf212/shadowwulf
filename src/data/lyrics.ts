/**
 * The words. These are the exact lyric sheets that were fed to MiniMax-Music3
 * to generate the record, so what is printed here is what is sung — including
 * the ALL-CAPS lines, which are group shouts, not emphasis.
 */

export interface LyricSection {
  tag: string
  lines: string[]
}

export const LYRICS: Record<number, LyricSection[]> = {
  "1": [
    {
      tag: "intro",
      lines: [
        "Ah",
        "Ah",
        "Ah oh",
        "Ah"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Oh oh, oh oh",
        "Ah ah",
        "Oh oh, oh oh",
        "Ah ah"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "Ay ah",
        "Ay ah",
        "Oh oh, oh oh",
        "Ah"
      ]
    },
    {
      tag: "outro",
      lines: [
        "The dark just took a breath",
        "Torches high, the iron door",
        "He walks in front of us all",
        "SHADOWWULF"
      ]
    }
  ],
  "2": [
    {
      tag: "intro",
      lines: [
        "Oh oh, oh oh",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Cold on the handle, dust in the air",
        "Six of us breathing, nobody scared",
        "That is a lie and we all know it",
        "Somebody laughs and the fear lets go"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "He gives the count",
        "He calls the turn",
        "One torch lit",
        "Then all six burn"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torchlight",
        "Hold it high",
        "Nobody walks in alone",
        "Torchlight",
        "Steady and slow",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Iron in the hinges, rust on the ring",
        "This is the room where we lost everything",
        "Let it come hungry, let it come loud",
        "We did not come here to turn around"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "He gives the count",
        "He calls the turn",
        "One torch lit",
        "Then all six burn"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torchlight",
        "Hold it high",
        "Nobody walks in alone",
        "Torchlight",
        "Steady and slow",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "Every scar in this hall has a name",
        "Every one of us came back again",
        "Oh oh, oh oh",
        "We came back"
      ]
    },
    {
      tag: "breakdown",
      lines: [
        "TORCHES UP",
        "DOOR GOES DOWN",
        "TORCHES UP",
        "HOLD THE LINE"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torchlight",
        "Hold it high",
        "Nobody walks in alone",
        "Torchlight",
        "Steady and slow",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Oh oh, oh oh",
        "Nobody walks in alone",
        "Oh oh, oh oh"
      ]
    }
  ],
  "3": [
    {
      tag: "intro",
      lines: [
        "ALL HAIL! ALL HAIL!",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Down where the torchlight ends,",
        "he walks in slow and calm.",
        "He knows the count.",
        "He calls the turn.",
        "Slade on his left,",
        "Claire on his right,",
        "Mom, Dad, and Graham behind.",
        "Down here they know his name.",
        "They call him ShadowWulf."
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "The floor shakes.",
        "Here they come.",
        "He says, Stay close. On three.",
        "He never leaves a friend.",
        "Now, torches high!"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torches high!",
        "All hail! All hail!",
        "Ronin, king of the dark!",
        "Raise the blade!",
        "All hail! All hail!",
        "Ronin, king of the dark!"
      ]
    },
    {
      tag: "verse",
      lines: [
        "I went down in the smoke,",
        "I heard him call my name.",
        "Hand on my back, I rise.",
        "He takes the lesser blade",
        "and gives the gold away.",
        "He holds the front alone."
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "Then a voice comes through the noise,",
        "steady as a drum.",
        "Stay down. I've got you.",
        "I'm coming.",
        "The final hit, and it falls.",
        "Now, torches high!"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torches high!",
        "All hail! All hail!",
        "Ronin, king of the dark!",
        "Raise the blade!",
        "All hail! All hail!",
        "Ronin, king of the dark!",
        "He bows to no throne,",
        "he fights for his own,",
        "oh oh, oh oh,",
        "Ronin, king of the dark!"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "Who holds the line?",
        "RONIN!",
        "Who takes the hit?",
        "RONIN!",
        "Who brings us home?",
        "RONIN!",
        "Say his name!",
        "SHADOWWULF!"
      ]
    },
    {
      tag: "breakdown",
      lines: [
        "No lord! No chain!",
        "He chose us all the same!",
        "No lord! No chain!",
        "SHADOWWULF!",
        "The giant falls.",
        "The torches rise.",
        "The gate swings wide.",
        "We walk out kings."
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Torches high!",
        "All hail! All hail!",
        "Ronin, king of the dark!",
        "Raise the blade!",
        "All hail! All hail!",
        "Ronin, king of the dark!",
        "He bows to no throne,",
        "he fights for his own,",
        "no one falls alone,",
        "Ronin, king of the dark!"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Six went in. Six walk out.",
        "Ronin comes home last.",
        "He always comes home last.",
        "Ronin, king of the dark."
      ]
    }
  ],
  "4": [
    {
      tag: "intro",
      lines: [
        "Oh oh, oh oh",
        "SIX WENT IN",
        "Oh oh, oh oh",
        "SIX WALK OUT"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Slade hits first and the front line holds",
        "Claire calls the trap before it opens",
        "Dad on the back wall, nothing gets through",
        "Mom brings you back when the lights go out"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "Count us off",
        "One to six",
        "Say the names",
        "Every time"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "Nobody left behind",
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "He always comes home last"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Graham hits the stairs like the stairs are his",
        "Nobody gave him the odds",
        "Ronin walks the front like he always has",
        "Hands you the gold, keeps the dust"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "Count us off",
        "One to six",
        "Say the names",
        "Every time"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "Nobody left behind",
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "He always comes home last"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "He hands me the good blade",
        "Keeps the lesser one",
        "Never says a word",
        "Oh oh, oh oh",
        "That is why we go"
      ]
    },
    {
      tag: "breakdown",
      lines: [
        "ONE",
        "TWO",
        "THREE",
        "FOUR",
        "FIVE",
        "SIX",
        "SIX WALK OUT"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "Nobody left behind",
        "SIX WENT IN",
        "SIX WALK OUT",
        "Oh oh, oh oh",
        "He always comes home last"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Oh oh, oh oh",
        "Six went in",
        "Six walk out",
        "Oh oh, oh oh",
        "He always comes home last"
      ]
    }
  ],
  "5": [
    {
      tag: "intro",
      lines: [
        "Oh oh, oh oh",
        "Oh oh, oh oh",
        "Deep below the stone",
        "Something learns our names"
      ]
    },
    {
      tag: "verse",
      lines: [
        "Dust comes down before the sound",
        "Every torch leans to the ground",
        "Up and up the shoulders go",
        "Past the roof of everything we know",
        "It has slept a thousand years",
        "And it wakes up hungry",
        "And it wakes up here"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "Six of us",
        "One narrow stair",
        "Slade on the left",
        "Claire in the air",
        "Mom and Dad across the line",
        "Graham on the light",
        "And he calls the time"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "So let it wake",
        "So let it roar",
        "Oh oh, oh oh",
        "We hold the door",
        "It knows his name",
        "And so do we",
        "SHADOWWULF",
        "SHADOWWULF"
      ]
    },
    {
      tag: "verse",
      lines: [
        "The first hit takes the stair away",
        "Mom pulls Graham out of the way",
        "Everybody's running out",
        "He turns around",
        "And walks the other way",
        "Down the middle of the roar",
        "With the lesser blade",
        "And the iron door behind him"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "The count goes three",
        "The count goes two",
        "He does the thing he always does",
        "He steps in front of you"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "So let it wake",
        "So let it roar",
        "Oh oh, oh oh",
        "We hold the door",
        "It knows his name",
        "And so do we",
        "SHADOWWULF",
        "SHADOWWULF"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "It has a hundred winters in its hands",
        "It has a mountain in its chest",
        "It has never lost",
        "It has never lost",
        "It has never met the six of us"
      ]
    },
    {
      tag: "breakdown",
      lines: [
        "DOWN",
        "BRING IT DOWN",
        "DOWN",
        "BRING IT DOWN",
        "SIX WENT IN",
        "SIX WALK OUT"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Oh oh, oh oh",
        "Oh oh, oh oh",
        "It knew his name",
        "Oh oh, oh oh"
      ]
    }
  ],
  "6": [
    {
      tag: "intro",
      lines: [
        "Oh oh, oh oh",
        "Smoke on the floor"
      ]
    },
    {
      tag: "verse",
      lines: [
        "I went down in the smoke",
        "I don't know how",
        "My torch rolled off",
        "Somewhere in the loud",
        "The stone is cold",
        "The horde is near",
        "And under all of it",
        "Boots",
        "Coming here"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "Everyone is running out",
        "He is running in",
        "Everyone is going up",
        "He is coming down again"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Stay down",
        "I've got you",
        "I'm coming",
        "Oh oh, oh oh",
        "No one falls alone",
        "No one falls alone"
      ]
    },
    {
      tag: "verse",
      lines: [
        "He doesn't say a word about the fear",
        "He just says the plan",
        "Three steps left",
        "Give me your hand",
        "He puts the good sword in my hand",
        "And keeps the lesser one",
        "And turns to face the whole of it",
        "Like it's already done"
      ]
    },
    {
      tag: "pre-chorus",
      lines: [
        "I said go",
        "He said no",
        "I said leave me",
        "He said no",
        "And the torchlight came back on"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Stay down",
        "I've got you",
        "I'm coming",
        "Oh oh, oh oh",
        "No one falls alone",
        "No one falls alone"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "Six went in",
        "Six walk out",
        "That is the only count he keeps",
        "And he keeps it",
        "Oh oh, oh oh",
        "SAY IT AGAIN",
        "NO ONE FALLS ALONE"
      ]
    },
    {
      tag: "breakdown",
      lines: [
        "NOT ONE",
        "NOT ONE",
        "NO ONE FALLS ALONE"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Oh oh, oh oh",
        "No one falls alone",
        "Stay down",
        "I've got you"
      ]
    }
  ],
  "7": [
    {
      tag: "intro",
      lines: [
        "Oh oh, oh oh",
        "Oh oh, oh oh"
      ]
    },
    {
      tag: "verse",
      lines: [
        "The iron door gives way",
        "The hinge lets go at last",
        "And the morning comes in cold and gold",
        "And older than the dark",
        "Slade comes out still laughing",
        "Claire still holding fast",
        "Graham has got the map",
        "Mom counts to five",
        "And waits"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Put the torches down",
        "Oh oh, oh oh",
        "Six went in",
        "Six walk out",
        "And he comes home last"
      ]
    },
    {
      tag: "verse",
      lines: [
        "He gave the gold away again",
        "He never tells us why",
        "He keeps the lesser blade",
        "And counts us out the door",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "And then the light gets him",
        "And that makes six"
      ]
    },
    {
      tag: "chorus",
      lines: [
        "Put the torches down",
        "Oh oh, oh oh",
        "Six went in",
        "Six walk out",
        "And he comes home last"
      ]
    },
    {
      tag: "bridge",
      lines: [
        "Torches low",
        "All hail",
        "All hail",
        "Ronin",
        "King of the dark",
        "Rest the blade"
      ]
    },
    {
      tag: "outro",
      lines: [
        "Oh oh, oh oh",
        "Oh oh, oh oh",
        "Six walk out",
        "Oh oh, oh oh",
        "He always comes home last"
      ]
    }
  ]
}
