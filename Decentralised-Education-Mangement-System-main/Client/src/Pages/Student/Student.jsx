import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData, studentRegister } from "../../Redux/student/action";

//component imports
import Header from "../../Components/Header/Header";
import Navbar from "../../Components/Sidebar/Navbar";
import AddIcon from "../../Components/AddIcon/AddIcon";
import StudentRow from "../../Components/Table/studentRow";

//css imports
import { Button, Drawer, Space, Spin, message } from "antd";
import "./Student.css";

const Student = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterStudent, setFilterStudent] = useState('');

  //alert api
  const [messageApi, contextHolder] = message.useMessage();

  //loading state
  const [loading, setLoading] = useState(false);

  //redux states
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students, load } = useSelector((store) => store.student);

  //drawer states
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //form states and functions
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    class: "",
  };
  const [FormData, setFormData] = useState(initialFormData);
  const handleInputChange = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (FormData.class == "") {
      return messageApi.open({
        type: "info",
        content: "Please select class",
        duration: 3,
      });
    }
    setLoading(true);
    dispatch(studentRegister(FormData))
      .then((res) => {
        if (res.msg === "User already registered") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "User already registered",
            duration: 3,
          });
        } else if (res.msg === "Student Registration failed") {
          setLoading(false);
          messageApi.open({
            type: "error",
            content: "Student Registration failed",
            duration: 3,
          });
        } else {
          setLoading(false);
          setFormData(initialFormData);
          onClose();
          messageApi.open({
            type: "success",
            content: "Student Registered Successfully",
            duration: 3,
          });
          messageApi.open({
            type: "success",
            content: "Password sent over mail.",
            duration: 3,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(getStudentData(filterStudent));
  }, [filterStudent]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  return (
    <Navbar>
      <div className="admin">
        <Header Title={"Student Data"} Address={"Student"} />

        {/* Filter by Class */}
        <select style={{ width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '20px', marginBottom:'10px' }} value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)}>
          <option value="">Filter by Semester</option>
              <option value={5}>1</option>
              <option value={6}>2</option>
              <option value={7}>3</option>
              <option value={8}>4</option>
              <option value={9}>5</option>
              <option value={10}>6</option>
              <option value={10}>7</option>
              <option value={10}>8</option>
        </select>
        <div className="adminData">
          <section className="tableBody">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Semester</th>
                  <th>Access</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((data, i) => {
                  return <StudentRow data={data} key={i} />;
                })}
              </tbody>
            </table>
          </section>
        </div>
        <div onClick={showDrawer}>
          <AddIcon />
        </div>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={onClose}
          open={open}
          style={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
            </Space>
          }
        >
          {contextHolder}
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              required
              name="name"
              type="text"
              value={FormData.name}
              placeholder="Enter Name"
              onChange={(e) => handleInputChange(e)}
            />
            <input
              required
              name="email"
              type="email"
              value={FormData.email}
              placeholder="Enter Email"
              onChange={(e) => handleInputChange(e)}
            />
            <input
              required
              name="password"
              type="password"
              value={FormData.password}
              placeholder="Enter Password"
              onChange={(e) => handleInputChange(e)}
            />
            <select name="class" onChange={(e) => handleInputChange(e)}>
              <option value="">Choose Semester</option>
              <option value={5}>1</option>
              <option value={6}>2</option>
              <option value={7}>3</option>
              <option value={8}>4</option>
              <option value={9}>5</option>
              <option value={10}>6</option>
              <option value={10}>7</option>
              <option value={10}>8</option>
            </select>
            <input type="submit" value="Add Student" />
          </form>
          {loading ? (
            <Space
              style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.2)",
                top: "0",
                left: "0",
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Spin size="large"></Spin>
            </Space>
          ) : null}
        </Drawer>
        {load ? (
          <Space
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              backgroundColor: "rgba(0,0,0,0.2)",
              top: "0",
              left: "0",
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            <Spin size="large"></Spin>
          </Space>
        ) : null}
      </div>
    </Navbar>
  );
};

export default Student;
