let focusGrid;

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { focus: false, data: this.props.data };
  }
  render() {
    let status = "";

    if (this.state.data === 0) {
      let className = this.state.focus ? "grid none focus" : "grid none";
      return (
        <li onClick={this.clickHandler.bind(this)} className={className}>
          &nbsp;
        </li>
      );
    }
    if (this.props.error) {
      status += " error";
    } else status += " legal";
    if (!this.props.init) {
      return <li className={"grid init" + status}>{this.state.data}</li>;
    }
    if (this.state.focus) status += " focus";
    return (
      <li onClick={this.clickHandler.bind(this)} className={"grid " + status}>
        {this.state.data}
      </li>
    );
  }

  clickHandler() {
    if (focusGrid) focusGrid.setState({ focus: false });
    this.setState({ focus: true });
    focusGrid = this;
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let row = [];

    for (let i = 0; i < 9; i++) {
      row.push(
        <Grid
          data={this.props.array[i]}
          error={this.props.error[i]}
          row={this.props.row}
          col={i}
          callBack={this.props.callBack}
          init={!this.props.init[i]}
        />
      );
    }
    return <ul>{row}</ul>;
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let temp = [];
    for (let i = 0; i < 9; i++) {
      temp[i] = this.props.data[i].slice();
    }
    this.state = { board: temp };
  }
  render() {
    let error = [];
    for (let i = 0; i < 9; i++) {
      error[i] = new Array(9).fill(false);
    }
    for (let i = 0; i < 9; i++) {
      let rowRepeat = new Array(10).fill(0);
      let colRepeat = new Array(10).fill(0);
      for (let j = 0; j < 9; j++) {
        rowRepeat[this.state.board[i][j]]++;
        colRepeat[this.state.board[j][i]]++;
      }
      console.log(rowRepeat[9]);
      for (let j = 0; j < 9; j++) {
        if (rowRepeat[this.state.board[i][j]] > 1) {
          error[i][j] = true;
        }
        if (colRepeat[this.state.board[j][i]] > 1) {
          error[j][i] = true;
        }
      }
    }

    let square;
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        square = new Array(10).fill(0);
        for (let k = i; k < i + 3; k++) {
          for (let l = j; l < j + 3; l++) {
            square[this.state.board[k][l]]++;
          }
        }
        for (let k = i; k < i + 3; k++) {
          for (let l = j; l < j + 3; l++) {
            if (square[this.state.board[k][l]] > 1) error[k][l] = true;
          }
        }
      }
    }

    let board = [];
    for (let i = 0; i < 9; i++) {
      board.push(
        <Row
          array={this.state.board[i]}
          error={error[i]}
          row={i}
          callBack={this.callBackFunction.bind(this)}
          init={this.props.data[i]}
        />
      );
    }
    return board;
  }
  callBackFunction(row, col, val) {
    this.setState((currState, currProps) => {
      currState.board[row][col] = val;
      return { board: currState.board };
    });
  }
}

class NumButtom extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <li onClick={this.clickHandler.bind(this)}>{this.props.num}</li>;
  }
  clickHandler() {
    // alert(this.props.num);
    if (focusGrid) {
      focusGrid.setState({ data: this.props.num });
      focusGrid.props.callBack(
        focusGrid.props.row,
        focusGrid.props.col,
        this.props.num
      );
      // alert(focusGrid.props.row);
      // alert(focusGrid.props.col);
      this.props.num;
    }
  }
}

class NullBTN extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <li onClick={this.clickHandler.bind(this)}>清除</li>;
  }
  clickHandler() {
    if (focusGrid) {
      focusGrid.setState({ data: 0 });
      focusGrid.props.callBack(focusGrid.props.row, focusGrid.props.col, 0);
    }
  }
}

class NumButtomList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let list = [];
    for (let i = 1; i <= 9; i++) {
      list.push(<NumButtom num={i}></NumButtom>);
    }
    list.push(<NullBTN />);
    return <ul className="buttomFlex">{list}</ul>;
  }
}

window.addEventListener("load", () => {
  let root = ReactDOM.createRoot(document.getElementsByClassName("sudoku")[0]);
  var board = <Board data={question[1]} />;
  root.render(board);
  root = ReactDOM.createRoot(document.getElementsByClassName("numButtom")[0]);
  root.render(<NumButtomList />);
  document.addEventListener("keydown", (e) => {
    if (e.keyCode >= 49 && e.keyCode <= 58 && focusGrid) {
      let num = e.keyCode - 48;
      focusGrid.setState({ data: num });
      focusGrid.props.callBack(focusGrid.props.row, focusGrid.props.col, num);
    } else if ((e.keyCode === 8 || e.keyCode === 46) && focusGrid) {
      focusGrid.setState({ data: 0 });
      focusGrid.props.callBack(focusGrid.props.row, focusGrid.props.col, 0);
    }
  });
});

let question = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 8],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
  [
    [0, 3, 0, 6, 0, 0, 9, 1, 0],
    [6, 0, 2, 0, 0, 0, 3, 0, 8],
    [0, 0, 8, 0, 4, 0, 0, 0, 0],
    [8, 0, 0, 7, 0, 0, 0, 2, 3],
    [0, 2, 6, 0, 5, 0, 7, 0, 1],
    [0, 0, 3, 0, 2, 0, 0, 0, 0],
    [9, 0, 0, 5, 0, 7, 0, 0, 4],
    [2, 0, 7, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 6, 0, 7, 0],
  ],
];
