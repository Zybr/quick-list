import React from 'react';
import { connect } from 'react-redux';
import Editor from "../../components/Editor/Editor";
import MainState from "../../types/states/MainState";


// interface Props extends Readonly<any> {
//   item: {},
// }

class Main extends React.Component {
  // constructor(props: Props, context?: React.ReactNode) {
  //   super(props, context);
  //   console.log(props);
  // }

  public render() {
    return (
      <div data-testid="Main">
        <Editor/>
      </div>
    );
  }
}

export default connect(
  (state: MainState) => ({ // Map state to props
    root: state.item.root,
  }),
  (dispatch: Function) => ({ // Map dispatch to props
  })
)(Main as any);
