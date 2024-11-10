import { callApi } from "common/comUtil";
import React, { Fragment, Dispatch, useState, useEffect, useRef} from "react";
import { Rnd } from "react-rnd";

export type m_keyword1sProps = {
  children?: React.ReactNode;
};


function Button(){
  // callApi('som_test', null,'application/x-www-form-urlencoded');
  callApi('auto_exec_test', null,'application/x-www-form-urlencoded');
}

function Sample(props: m_keyword1sProps): JSX.Element  {
//-------------------------------------------------------------
//レンダリング
//-------------------------------------------------------------

const recd_style = {
    display: "flex",//中央寄せ
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a8a8a8",
  };
return (
    <Fragment>

      <button className="btn btn-outline-dark" onClick={() => { Button(); }}> 
          <span >テスト</span>
      </button>


      <div style={{marginTop: "90px"}}></div>
      <div style={{display: "flex",flexDirection: "column",height: "100vh"}}>
        <h1>コンテンツ1</h1>
        <p>コンテンツ2</p>

        <Rnd
          size={{
            width: "100%",
            height: 200 // 任意の高さを指定
          }}
          style={recd_style}
        >
        <h1>コンテンツ3</h1>
        </Rnd>

        <Rnd
          style={recd_style}
          size={{
            width: "100%",
            height: 200 // 任意の高さを指定
          }}
        >
          <h1>コンテンツ4</h1>
        </Rnd>
      </div>

    </Fragment >
  );
};

export default Sample;
