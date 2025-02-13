import React, { useRef, useState } from 'react';
import "./App.css";
import { core } from '@tauri-apps/api';

function CVGenerator() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const [workExp, setWorkExp] = useState([]);
  const [project, setProject] = useState([]);
  const [education, setEducation] = useState([]);
  const [skill, setSkill] = useState([]);
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

  const addProject = () => { 
    setProject([
      ...project,
      {
        nameRef: React.createRef(),
        introRef: React.createRef(),
        dateRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef()
      }
    ]);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        schoolRef: React.createRef(),
        degreeRef: React.createRef(),
        dateRangeRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef()
      }
    ]);
  };

  const addSkill = () => {
    setSkill([
      ...skill,
      {
        skillRef: React.createRef()
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
      })),
      projects: project.map(proj => ({
        name: proj.nameRef.current.value,
        introduction: proj.introRef.current.value,
        dates: proj.dateRef.current.value,
        location: proj.locationRef.current.value,
        desc_items: [
          proj.desc1Ref.current.value,
          proj.desc2Ref.current.value,
          proj.desc3Ref.current.value
        ]
      })),
      educations: education.map(edu => ({
        school: edu.schoolRef.current.value,
        degree: edu.degreeRef.current.value,
        date_range: edu.dateRangeRef.current.value,
        location: edu.locationRef.current.value,
        desc_items: [
          edu.desc1Ref.current.value,
          edu.desc2Ref.current.value,
          edu.desc3Ref.current.value
        ]
      })),
      skills: skill.map(s => s.skillRef.current.value)
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
            <input type="text" ref={nameRef} style={{ padding: "5px", width: "200px" }} 
                autoComplete="name"/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Email:</label>
            <input type="email" ref={emailRef} style={{ padding: "5px", width: "200px" }} 
                autoComplete="email"/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Phone:</label>
            <input type="tel" ref={phoneRef} style={{ padding: "5px", width: "200px" }} 
                autoComplete="tel"/>
        </div>
      </div>
      <div><button onClick={addWorkExp}>Add Work Experience</button></div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: workExp.length > 0 ? '580px' : '60px',
          display: workExp.length === 0 ? 'none' : 'block',
          overflowY: 'auto'
        }}
      >
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
      <div><button onClick={addProject}>Add Project</button></div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: project.length > 0 ? '580px' : '60px',
          display: project.length === 0 ? 'none' : 'block',
          overflowY: 'auto'
        }}
      >
        {project.map((proj, index) => (
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
          <h3 style={{ margin: "0 0 0 0" }}>Project {index + 1}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Name:</label>
            <input type="text" ref={proj.nameRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Introduction:</label>
            <input type="text" ref={proj.introRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Date:</label>
            <input type="text" ref={proj.dateRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Location:</label>
            <input type="text" ref={proj.locationRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 1:</label>
            <textarea ref={proj.desc1Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 2:</label>
            <textarea ref={proj.desc2Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 3:</label>
            <textarea ref={proj.desc3Ref} style={{ flex: "1", height: "75px" }} />
          </div>
        </div>
        ))}
      </div>
      <div><button onClick={addEducation}>Add Education</button></div>
      <div
        style={{
          display: education.length === 0 ? 'none' : 'block',
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: education.length > 0 ? '580px' : '0px',
          overflowY: 'auto'
        }}
      >
        
        {education.map((edu, index) => (
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
          <h3 style={{ margin: "0 0 0 0" }}>Education {index + 1}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>School:</label>
            <input type="text" ref={edu.schoolRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Degree:</label>
            <input type="text" ref={edu.degreeRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Date:</label>
            <input type="text" ref={edu.dateRangeRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Location:</label>
            <input type="text" ref={edu.locationRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 1:</label>
            <textarea ref={edu.desc1Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 2:</label>
            <textarea ref={edu.desc2Ref} style={{ flex: "1", height: "75px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Description 3:</label>
            <textarea ref={edu.desc3Ref} style={{ flex: "1", height: "75px" }} />
          </div>
        </div>
        ))}
      </div>
      <div><button onClick={addSkill}>Add Skill</button> </div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: skill.length > 0 ? '400px' : '60px',
          display: skill.length === 0 ? 'none' : 'block',
          overflowY: 'auto'
        }}
      >
        {skill.map((s, index) => (
          <div
          key={index}
          style={{
            marginBottom: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
        <input type="text" ref={s.skillRef} style={{width: "100px"}} />
        </div>
        ))}
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CVGenerator;