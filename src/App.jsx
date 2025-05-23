import React, { useRef, useState, useEffect } from 'react';
import "./App.css";
import { core } from '@tauri-apps/api';
import { open } from '@tauri-apps/plugin-dialog';
import { save } from '@tauri-apps/plugin-dialog';

function CVGenerator() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const websiteRef = useRef(null);
  const linkedinRef = useRef(null);
  const templateRef = useRef(null);
  const [workExp, setWorkExp] = useState([]);
  const [project, setProject] = useState([]);
  const [education, setEducation] = useState([]);
  const [skillGroup, setSkillGroup] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const templateImages = {
    template1: "/images/template1_preview.png",
    template2: "/images/template2_preview.png",
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const addWorkExp = () => {
    setWorkExp([
      ...workExp,
      {
        companyRef: React.createRef(),
        titleRef: React.createRef(),
        dateStartRef: React.createRef(),
        dateEndRef: React.createRef(),
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
        dateStartRef: React.createRef(),
        dateEndRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef()
      }
    ]);
  };

  const addSkillGroup = () => {
    setSkillGroup((prev) => [
      ...prev,
      {
        groupNameRef: React.createRef(),
        skills: [],
      },
    ]);
  };

  const addSkillToGroup = (groupIndex) => {
    const newSkillRef = React.createRef();
  
    setSkillGroup((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        // Insert the new ref into this group's skills
        skills: [...updated[groupIndex].skills, newSkillRef],
      };
      return updated;
    });
    // Focus the new skill input after the state update
    setTimeout(() => {
      newSkillRef.current?.focus();
    }, 0);
  };

  const escapeLatex = (text) => {
    if (!text) return "";
    return text
      .replace(/#/g, "\\#")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_")
      .replace(/\$/g, "\\$")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/&/g, "\\&")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/~/g, "\\textasciitilde{}");
  };

  const handleSubmit = async () => {
    let fileName = "";
    if (nameRef.current.value !== "") {
      fileName = nameRef.current.value + "_cv.pdf";
    }
    else {
      alert("Please enter your name before submitting.");
      return;
    }

    const filePath = await save({
      filters: [{ name: "PDF Files", extensions: ["pdf"] }],
      defaultPath: fileName,
    });

    if (!filePath) {
      console.log("User canceled file selection.");
      return;
    }

    const formatMonth = (value) => {
      if (!value) return "";
      const [year, month] = value.split("-");
      if (year && month && !isNaN(year) && !isNaN(month)) {
        const dateObj = new Date(year, month - 1);
        return dateObj.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
      } else {
        return value;
      }
    };
    const data = {
      name: escapeLatex(nameRef.current.value),
      email: escapeLatex(emailRef.current.value),
      phone: escapeLatex(phoneRef.current.value),
      website: escapeLatex(websiteRef.current.value),
      linkedin: escapeLatex(linkedinRef.current.value),
      template: escapeLatex(templateRef.current.value),
      jobs: workExp.map(exp => ({
        company: escapeLatex(exp.companyRef.current.value),
        title: escapeLatex(exp.titleRef.current.value),
        date_range: formatMonth(exp.dateStartRef.current.value) + " - " + formatMonth(exp.dateEndRef.current.value),
        location: escapeLatex(exp.locationRef.current.value),
        desc_items: [
          escapeLatex(exp.desc1Ref.current.value),
          escapeLatex(exp.desc2Ref.current.value),
          escapeLatex(exp.desc3Ref.current.value)
        ]
      })),
      projects: project.map(proj => ({
        name: escapeLatex(proj.nameRef.current.value),
        introduction: escapeLatex(proj.introRef.current.value),
        dates: formatMonth(proj.dateRef.current.value),
        location: escapeLatex(proj.locationRef.current.value),
        desc_items: [
          escapeLatex(proj.desc1Ref.current.value),
          escapeLatex(proj.desc2Ref.current.value),
          escapeLatex(proj.desc3Ref.current.value)
        ]
      })),
      educations: education.map(edu => ({
        school: escapeLatex(edu.schoolRef.current.value),
        degree: escapeLatex(edu.degreeRef.current.value),
        date_range: formatMonth(edu.dateStartRef.current.value) + " - " + formatMonth(edu.dateEndRef.current.value),
        location: escapeLatex(edu.locationRef.current.value),
        desc_items: [
          escapeLatex(edu.desc1Ref.current.value),
          escapeLatex(edu.desc2Ref.current.value),
          escapeLatex(edu.desc3Ref.current.value)
        ]
      })),
      skills: skillGroup.map(group => ({
        groupName: escapeLatex(group.groupNameRef.current.value),
        skills: group.skills.map(skillRef => escapeLatex(skillRef.current.value))
      }))
    };
    console.log(data);
    try {
      // const result = await core.invoke("run_python_script", { data: data });
      await core.invoke("run_rust_pdf_generator", { jsonData: JSON.stringify(data), outputPath: filePath });
      alert("✅ PDF generated successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExport = async () => {

    let fileName = "";
    if (nameRef.current.value !== "") {
      fileName = nameRef.current.value + "_cv.json";
    }
    else {
      alert("Please enter your name before submitting.");
      return;
    }

    const filePath = await save({
      filters: [{ name: "JSON Files", extensions: ["json"] }],
      defaultPath: fileName,
    });

    if (!filePath) {
      console.log("User canceled file selection.");
      return;
    }

    const formatMonth = (value) => {
      if (!value) return "";
      const [year, month] = value.split("-");
      if (year && month && !isNaN(year) && !isNaN(month)) {
        const dateObj = new Date(year, month - 1);
        return dateObj.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
      } else {
        return value;
      }
    };
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      website: websiteRef.current.value,
      linkedin: linkedinRef.current.value,
      jobs: workExp.map(exp => ({
        company: exp.companyRef.current.value,
        title: exp.titleRef.current.value,
        date_range: formatMonth(exp.dateStartRef.current.value) + " - " + formatMonth(exp.dateEndRef.current.value),
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
        dates: formatMonth(proj.dateRef.current.value),
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
        date_range: formatMonth(edu.dateStartRef.current.value) + " - " + formatMonth(edu.dateEndRef.current.value),
        location: edu.locationRef.current.value,
        desc_items: [
          edu.desc1Ref.current.value,
          edu.desc2Ref.current.value,
          edu.desc3Ref.current.value
        ]
      })),
      skills: skillGroup.map(group => ({
        groupName: group.groupNameRef.current.value,
        skills: group.skills.map(skillRef => skillRef.current.value)
      }))
    };
    try {
      await core.invoke("save_json", { jsonData: JSON.stringify(data), outputPath: filePath  });
      alert("✅ JSON saved successfully!");
    } catch (error) {
      console.error("❌ Error saving JSON:", error);
      alert("❌ Failed to save JSON.");
    }
  };

  const handleImport = async () => {
    try {
      const filePath = await open({
        multiple: false,
        directory: false,
      });
      if (!filePath) return;
  
      const jsonData = await core.invoke("import_json", { filePath });
      const parsedData = JSON.parse(jsonData);
      console.log(parsedData);
      nameRef.current.value = parsedData.name || "";
      emailRef.current.value = parsedData.email || "";
      phoneRef.current.value = parsedData.phone || "";
      websiteRef.current.value = parsedData.website || "";
      linkedinRef.current.value = parsedData.linkedin || "";
  
      const newWorkExp = parsedData.jobs.map(job => ({
        companyRef: React.createRef(),
        titleRef: React.createRef(),
        dateStartRef: React.createRef(),
        dateEndRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef(),
      }));
      setWorkExp(newWorkExp);
  
      // Update Projects
      const newProjects = parsedData.projects.map(proj => ({
        nameRef: React.createRef(),
        introRef: React.createRef(),
        dateRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef(),
      }));
      setProject(newProjects);
  
      // Update Education
      const newEducation = parsedData.educations.map(edu => ({
        schoolRef: React.createRef(),
        degreeRef: React.createRef(),
        dateStartRef: React.createRef(),
        dateEndRef: React.createRef(),
        locationRef: React.createRef(),
        desc1Ref: React.createRef(),
        desc2Ref: React.createRef(),
        desc3Ref: React.createRef(),
      }));
      setEducation(newEducation);
  
      const newSkillGroups = (parsedData.skills || []).map(group => ({
        groupNameRef: React.createRef(),
        skills: (group.skills || []).map(() => React.createRef()),
      }));
      console.log("newSkillGroups:", newSkillGroups);
      setSkillGroup(newSkillGroups);
      //Set values after the state update
      setTimeout(() => {
        newWorkExp.forEach((exp, index) => {
          exp.companyRef.current.value = parsedData.jobs[index].company || "";
          exp.titleRef.current.value = parsedData.jobs[index].title || "";
          exp.locationRef.current.value = parsedData.jobs[index].location || "";
          exp.desc1Ref.current.value = parsedData.jobs[index].desc_items[0] || "";
          exp.desc2Ref.current.value = parsedData.jobs[index].desc_items[1] || "";
          exp.desc3Ref.current.value = parsedData.jobs[index].desc_items[2] || "";
  
          // Extract and format start & end dates
          const dateRange = parsedData.jobs[index].date_range || "";
          const [startDate, endDate] = dateRange.split(" - ");
          exp.dateStartRef.current.value = startDate ? formatDateToInput(startDate) : "";
          exp.dateEndRef.current.value = endDate ? formatDateToInput(endDate) : "";
        });
  
        newProjects.forEach((proj, index) => {
          proj.nameRef.current.value = parsedData.projects[index].name || "";
          proj.introRef.current.value = parsedData.projects[index].introduction || "";
          proj.locationRef.current.value = parsedData.projects[index].location || "";
          proj.desc1Ref.current.value = parsedData.projects[index].desc_items[0] || "";
          proj.desc2Ref.current.value = parsedData.projects[index].desc_items[1] || "";
          proj.desc3Ref.current.value = parsedData.projects[index].desc_items[2] || "";
  
          // Extract and format project date
          const projectDate = parsedData.projects[index].dates || "";
          proj.dateRef.current.value = projectDate ? formatDateToInput(projectDate) : "";
        });
        newEducation.forEach((edu, index) => {
          edu.schoolRef.current.value = parsedData.educations[index].school || "";
          edu.degreeRef.current.value = parsedData.educations[index].degree || "";
          edu.locationRef.current.value = parsedData.educations[index].location || "";
          edu.desc1Ref.current.value = parsedData.educations[index].desc_items[0] || "";
          edu.desc2Ref.current.value = parsedData.educations[index].desc_items[1] || "";
          edu.desc3Ref.current.value = parsedData.educations[index].desc_items[2] || "";
  
          // Extract and format start & end dates
          const dateRange = parsedData.educations[index].date_range || "";
          const [startDate, endDate] = dateRange.split(" - ");
          edu.dateStartRef.current.value = startDate ? formatDateToInput(startDate) : "";
          edu.dateEndRef.current.value = endDate ? formatDateToInput(endDate) : "";
        });
        console.log("newSkillGroups:", newSkillGroups);
        newSkillGroups.forEach((groupObj, groupIndex) => {
          const groupData = (parsedData.skills || [])[groupIndex] || {};
          groupObj.groupNameRef.current.value = groupData.groupName || "";
          // Fill each skill input
          groupObj.skills.forEach((skillRef, skillIx) => {
            skillRef.current.value = (groupData.skills || [])[skillIx] || "";
          });
        });
  
      }, 0);
      console.log("✅ JSON loaded successfully!");
    } catch (error) {
      console.error("❌ Failed to load JSON:", error);
      alert("❌ Error loading JSON.");
    }
  };
  
  const formatDateToInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  useEffect(() => {
    if (workExp.length > 0 ){
      workExp[workExp.length - 1].companyRef.current.focus();
    }
  }, [workExp]);

  useEffect(() => {
    if (project.length > 0 ){
      project[project.length - 1].nameRef.current.focus();
    }
  }, [project]);

  useEffect(() => {
    if (education.length > 0 ){
      education[education.length - 1].schoolRef.current.focus();
    }
  }, [education]);

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

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Website:</label>
            <input type="url" ref={websiteRef} style={{ padding: "5px", width: "200px" }}/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "50px" }}>Linkedin:</label>
            <input type="url" ref={linkedinRef} style={{ padding: "5px", width: "200px" }}/>
        </div>
      </div>
      <div><button onClick={addWorkExp}>Add Work Experience</button></div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: '525px',
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
            <label style={{ width: "100px" }}>From:</label>
            <input type="month" ref={exp.dateStartRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>To:</label>
            <input type="month" ref={exp.dateEndRef} style={{width: "200px"}} />
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
          height: '525px',
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
            <input type="month" ref={proj.dateRef} style={{width: "200px"}} />
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
          height: '525px',
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
            <label style={{ width: "100px" }}>From:</label>
            <input type="month" ref={edu.dateStartRef} style={{width: "200px"}} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>To:</label>
            <input type="month" ref={edu.dateEndRef} style={{width: "200px"}} />
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
      <div><button onClick={addSkillGroup}>Add Skill Group</button> </div>
      <div
        style={{
          border: '2px groove',
          padding: '10px',
          marginBottom: '10px',
          height: skillGroup.length > 0 ? '200px' : '60px',
          display: skillGroup.length === 0 ? 'none' : 'block',
          overflowY: 'auto'
        }}
      >


        {skillGroup.map((group, groupIndex) => (
          <div
          key={groupIndex}
          style={{
            border: "1px groove #0f0f0f",
            padding: "10px",
            marginBottom: "5px",
          }}
        >
          <h3 style={{ margin: "0 0 0 0" }}>Skill Group {groupIndex + 1}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px" }}>Category:</label>
            <input type="text" ref={group.groupNameRef} style={{width: "200px"}} />
          </div>
          <h4>Skills:</h4>
          {group.skills.map((skillRef, skillIndex) => (
            <div key={skillIndex} style={{
              margin: "10px 5px",
              display: "inline-flex",
              flexDirection: "column",
              gap: "10px",
            }}>
              <input type="text" ref={skillRef} style={{width: "100px"}} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkillToGroup(groupIndex);
                }}}
              />
            </div>
          ))}
          <button onClick={() => addSkillToGroup(groupIndex)}>Add Skill</button>
        </div>
        ))}

        {/* {skill.map((s, index) => (
          <div
          key={index}
          style={{
            margin: "10px 5px",
            display: "inline-flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
        <input type="text" ref={s.skillRef} style={{width: "100px"}} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addSkill();
          }}}
        />
        </div>
        ))} */}
      </div>

      <div>
        <button onClick={handleSubmit}>Submit</button>
        <label>Template: </label>
        <select name="template" ref={templateRef} onChange={handleTemplateChange}>
          {Object.keys(templateImages).map((template) => (
            <option key={template} value={template}>
              {template.replace("template", "Template ")}
            </option>
          ))}
        </select>
          <img
            src={templateImages[selectedTemplate]}
            alt={`${selectedTemplate} preview`}
            style={{
              width: "150px",
              height: "auto",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginLeft: "10px",
              verticalAlign: "top",
            }}
          />
      </div>
      <hr></hr>
      <div style={{ display: "flex", gap: "5px" }}>
        <button 
          onClick={handleExport} 
          style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "3px", margin: "4px"}}
        >
          Export
        </button>
        <button 
          onClick={handleImport} 
          style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "3px", margin: "4px" }}
        >
          Import
        </button> 
      </div>

    </div>
  );
}

export default CVGenerator;