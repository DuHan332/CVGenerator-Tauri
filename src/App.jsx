import React, { useRef, useState } from 'react';
import "./App.css";
import { core } from '@tauri-apps/api';

function CVGenerator() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const [workExp, setWorkExp] = useState([]);
  const [response, setResponse] = useState("");

  const addWorkExp = () => {
    setWorkExp([
      ...workExp,
      {
        companyRef: React.createRef(),
        titleRef: React.createRef(),
        dateRangeRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef()
      }
    ]);
  };

  const handleSubmit = () => {
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      jobs: workExp.map(exp => ({
        company: exp.companyRef.current.value,
        title: exp.titleRef.current.value,
        date_range: exp.dateRangeRef.current.value,
        location: exp.locationRef.current.value,
        desc_items: [
          exp.desc1Ref.current.value,
          exp.desc2Ref.current.value,
          exp.desc3Ref.current.value
        ]
      }))
    };
    console.log(data);
    renderPdf(data);
  };


  const renderPdf = async (data) => {
    try {
      const result = await core.invoke("run_python_script", { data: data });
      setResponse(result);
    } catch (error) {
      console.error("Error calling Python:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          border: "2px groove",
          padding: "20px",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Name:</label>
            <input type="text" ref={nameRef} style={{ padding: "5px", width: "200px"}}/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Email:</label>
            <input type="text" ref={emailRef} style={{ padding: "5px", width: "200px"}}/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Phone:</label>
            <input type="text" ref={phoneRef} style={{ padding: "5px", width: "200px"}}/>
        </div>
      </div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: workExp.length > 0 ? '580px' : '60px',
          overflowY: 'auto'
        }}
      >
        <button onClick={addWorkExp}>Add Work Experience</button>
        {workExp.map((exp, index) => (
          <div
          key={index}
          style={{
            border: "1px groove #0f0f0f",
            padding: "10px",
            marginBottom: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h3 style={{ margin: "0 0 0 0" }}>Work Experience {index + 1}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Company:</label>
            <input type="text" ref={exp.companyRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Title:</label>
            <input type="text" ref={exp.titleRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Date Range:</label>
            <input type="text" ref={exp.dateRangeRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Location:</label>
            <input type="text" ref={exp.locationRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 1:</label>
            <textarea ref={exp.desc1Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 2:</label>
            <textarea ref={exp.desc2Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 3:</label>
            <textarea ref={exp.desc3Ref} style={{ flex: "1", height: "75px" }} />
          </div>
        </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CVGenerator;