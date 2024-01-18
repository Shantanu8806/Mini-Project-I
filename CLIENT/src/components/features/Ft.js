// import React from 'react';
// import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
// export default function Ft(){
    // let data=props.data
    // return(
    //   <MDBRow>
    //   <MDBCol md='8'>
    //     md="8"
    //   </MDBCol>
    //   <MDBCol md='4'>
    //     md="4"
    //   </MDBCol>
    // </MDBRow>
//         <div className=" flex flex-col w-10">
//           <img src={data.icon} height={100} width={100}></img>
//           <h2>{data.heading}</h2>
//           <p>{data.desc}</p>

        // </div>
//     )
// }

import React from 'react';
import './Ft.css' // You'll need to create a CSS file for styling
// import img from '../'
const Ft = () => {
  return (
    <div className="grid-container">
      <div className="grid-item">Column 1</div>
      <div className="grid-item">Column 2</div>
      <div className="grid-item">Column 3</div>
      <div className="grid-item">Column 4</div>
      <div className="grid-item">Column 5</div>
    </div>
  );
};

export default Ft;

