import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { CircularProgress } from "@mui/material";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [age, setAge] = useState("14");
  const [password, setPassword] = useState("@Abc123");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [relatePersonName, setRelatePersonName] = useState("");
  const [relatePersonPhone, setRelatePersonPhone] = useState("");
  const [relatePersonStatus, setRelatePersonStatus] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    name,
    rollNum,
    relatePersonName,
    relatePersonPhone,
    relatePersonStatus,
    password,
    sclassName,
    age,
    adminID,
    role,
    attendance,
  };

  const handleAge = (age) => {
    if (age > 13) {
      setAge(age);
    } else {
      setAge(age);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Members</span>
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter member's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          {situation === "Student" && (
            <>
              <label>Class</label>
              <select
                className="registerInput"
                value={className}
                onChange={changeHandler}
                required
              >
                <option value="Select Class">Select Class</option>
                {sclassesList.map((classItem, index) => (
                  <option key={index} value={classItem.sclassName}>
                    {classItem.sclassName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Roll Number</label>
          <input
            className="registerInput"
            type="number"
            placeholder="Enter member's Roll Number..."
            value={rollNum}
            onChange={(event) => setRollNum(event.target.value)}
            required
          />

          <label>Age</label>
          <input
            className="registerInput"
            type="number"
            placeholder="Enter member's Age..."
            value={age}
            min="0"
            max="70"
            onChange={(event) => handleAge(event.target.value)}
            required
          />

          {age <= 13 ? (
            <>
              <label>Related Person's Name</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter Person's Name..."
                value={relatePersonName}
                onChange={(event) => setRelatePersonName(event.target.value)}
                required
              />
              <label>Related Person's Phone Number</label>
              <input
                className="registerInput"
                type="number"
                placeholder="Enter Phone Number..."
                value={relatePersonPhone}
                onChange={(event) => setRelatePersonPhone(event.target.value)}
                required
              />
              <label>Relationship To Member</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter Relationship..."
                value={relatePersonStatus}
                onChange={(event) => setRelatePersonStatus(event.target.value)}
                required
              />
            </>
          ) : (
            ""
          )}

          <label hidden>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter member's password..."
            value={password}
            // onChange={(event) => setPassword("asdf")}
            autoComplete="new-password"
            required
            hidden
          />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddStudent;
