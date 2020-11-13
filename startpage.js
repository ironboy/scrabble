import Player from "./Player.js";

export default class Startpage {

  async start() {
    this.createBoard();
    await this.tilesFromFile();
    // console.table is a nice way
    // to log arrays and objects
    console.log(this.board);
    console.table(this.tiles);
    // create players
    this.players = [
      new Player(this, 'Player 1'),
      new Player(this, 'Player 2')
    ];
    console.table(this.players);
    // render the board + players
    this.render();
  }

  startPage() {
    let that = this;
    let startDiv = $('<div class="startpage"></div>');
    startDiv.append(`
    <h1 = class="title">Scrabble</h1>
    <button class="start-button"><h3>Start Game</h3></button>
    `);
    $('body').append(startDiv);
    $('.start-button').click(function () {
      that.start();
      $('.startpage').hide();
    });
  }

  createBoard() {
    // note: the real board has a lot of special squares
    // and is symmetrical - maybe we could generate it from a file
    // with data about the squares?

    // but for now just make an two-dimensional array
    // with the same object values for each item
    this.board = [...new Array(15)].map(x => new Array(15).fill({
      specialValue: '2w', // might be 3w or 2l or 3l or center as well
      // (2w = 2x word points, 2l = 2 x letters etc)
      // you need different values for diffrent squares
      // - not implemented yet ;)
      tile: undefined     // replace with a tile object when it is
      // is dragged to the square
      // - not implemented yet ;)
    }));
  }

  async tilesFromFile() {
    this.tiles = [];
    // Read the tile info from file
    (await $.get('tiles.txt'))
      .split('\r').join('') // Windows safe :)
      .split('\n').forEach(x => {
        // For each line split content by ' '
        // x[0] = char, x[1] = points, x[2] = occurences
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          this.tiles.push({ char: x[0], points: +x[1] })
        }
      });
    // Shuffle in random order
    this.tiles.sort(() => Math.random() - 0.5);
  }

  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.tiles)
    return this.tiles.splice(0, howMany);
  }

  render() {
    // Create the board and players divs
    $('.board, .players').remove();
    let $board = $('<div class="board"/>').appendTo('body');
    let $players = $('<div class="players"/>').appendTo('body');
    // Render the board
    // (will be more code when we know how to represent 
    //  the special squares)
    this.board.flat().forEach(x => $board.append('<div/>'));
    // Render the players
    this.players.forEach(player =>
      $players.append(player.render()));
    this.addDragEvents();
  }

  addDragEvents() {
    let that = this;
    // let tile in the stands be draggable
    $('.stand .tile').not('.none').draggabilly({ containment: 'body' })
      .on('dragStart', function () {
        // set a high z-index so that the tile being drag
        // is on top of everything  
        $(this).css({ zIndex: 100 });
      })
      .on('dragMove', function (e, pointer) {
        let { pageX, pageY } = pointer;

        // we will need code that reacts
        // if you have moved a tile to a square on the board
        // (light it up so the player knows where the tile will drop)
        // but that code is not written yet ;)

      })
      .on('dragEnd', function (e, pointer) {
        let { pageX, pageY } = pointer;
        let me = $(this);

        // reset the z-index
        me.css({ zIndex: '' });

        let player = that.players[+me.attr('data-player')];
        let tileIndex = +me.attr('data-tile');
        let tile = player.tiles[tileIndex];

        // we will need code that reacts
        // if you have moved a tile to a square on the board
        // (add the square to the board, remove it from the stand)
        // but that code is not written yet ;)

        // but we do have the code that let you
        // drag the tiles in a different order in the stands
        let $stand = me.parent('.stand');
        let { top, left } = $stand.offset();
        let bottom = top + $stand.height();
        let right = left + $stand.width();
        // if dragged within the limit of the stand
        if (pageX > left && pageX < right
          && pageY > top && pageY < bottom) {
          let newIndex = Math.floor(8 * (pageX - left) / $stand.width());
          let pt = player.tiles;
          // move around
          pt.splice(tileIndex, 1, ' ');
          pt.splice(newIndex, 0, tile);
          //preserve the space where the tile used to be
          while (pt.length > 8) { pt.splice(pt[tileIndex > newIndex ? 'indexOf' : 'lastIndexOf'](' '), 1); }
        }
        that.render();
      });
  }

}