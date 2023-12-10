# Zendo Online

This is a single-page, peer-to-peer, synchronous client for playing [Zendo](https://www.looneylabs.com/content/zendo) online. There is no central server except to connect peers. Once connected, all data transfers happen directly between peers.

Demo is currently at <https://www.perlkonig.com/zendo>.

## How It Works

When first opening the page, it creates a new game lobby and provides a client ID. One person needs to share that ID with their friends.

The other players enter that ID into the "Join" box and click "Join Game" to be connected with the others.

Once connected, players have access to a shared game interface. The game client does *not* offer things like video and voice chat features. Use services like Discord and Zoom instead. This client is designed just to help you moderate the game remotely. Should anybody become disconnected, they can simply "Join" using the ID of any player still in the game room.

## Dojo Types

The following dojo types are supported:

* plain text (koans are displayed as entered)
* images (drag and drop square image files)
* 1d & 2d pyramids (koans with [Looney pyramids](https://www.looneylabs.com/pyramids-home))
* 1d & 2d playing cards
* dot matrix (coloured dots on rectangular grids)
* [GraphViz](https://graphviz.org/) (rendered by [dot](https://graphviz.org/docs/layouts/dot/))
* [PlantUML](https://plantuml.com/) (rendered by PlantUML)
* math (powered by [KaTeX](https://katex.org/), using TeX/LaTeX notation)
