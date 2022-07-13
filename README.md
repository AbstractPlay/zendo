# Zendo Online

This is a single-page, peer-to-peer, synchronous client for playing [Zendo](https://www.looneylabs.com/content/zendo) online. There is no central server except to connect peers. Once connected, all data transfers happen directly between peers.

Demo is currently at <https://www.perlkonig.com/zendo>.

## How It Works

When first opening the page, it creates a new game lobby and provides a client ID. One person needs to share that ID with their friends.

The other players enter that ID into the "Join" box and clicks "Join Game" to be connected with the others.

Once connected, players have access to a basic text chat window and the rest of the game interface. The game client does *not* offer things like video and voice chat features. Use services like Discord and Zoom instead. This client is designed just to help you moderate the game remotely. Should anybody become disconnected, they can simply "Join" using the ID of any player still in the game room.

## Dojo Types

There are four dojo types currently supported:

* plain text (koans are displayed as entered)
* images (drag and drop square image files)
* math (powered by [KaTeX](https://katex.org/), using TeX/LaTeX notation)
* 2d pyramids (custom notation for creating two-dimensional koans with [Looney pyramids](https://www.looneylabs.com/pyramids-home))

## Caveats

There is no server! This means that clients can be hacked and people can cheat. Don't play with cheaters. Efforts have been made to prevent people from *accidentally* seeing the master's rule, but seeing it is indeed *possible* if the master enters it.
