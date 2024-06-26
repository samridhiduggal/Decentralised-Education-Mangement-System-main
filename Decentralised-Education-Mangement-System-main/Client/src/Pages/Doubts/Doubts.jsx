import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createDoubt, getDoubtData } from "../../Redux/doubt/action";

//component imports
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import AddIcon from "../../Components/AddIcon/AddIcon";
import DoubtBox from "../../Components/DoubtBox/DoubtBox";

//css imports
import { Button, Drawer, Space, Spin, message } from "antd";
import "./Doubts.css";

const Doubts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //redux states
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth.data);
  const { doubt, load } = useSelector((store) => store.doubt);

  //alert api antd
  const [messageApi, contextHolder] = message.useMessage();

  //loading state
  const [loading, setLoading] = useState(false);

  //drawer states and functions
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //form states and functions
  const initialFormData = {
    title: "",
    description: "",
    class: "",
    subject: "",
    name: user?.name,
    studentId: user?._id,
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //upload states
  const [size, setSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [filterDoubt, setFilterDoubt] = useState("");

  //upload refs
  const UploadRef = useRef();
  const WidgetRef = useRef();

  const handleSubmit = () => {
    for (let keys in formData) {
      if (formData[keys] == "") {
        return alert("please fill all the details");
      }
    }
    let obj = { ...formData, size, fileType, thumbnailUrl, fileUrl };
    setLoading(true);
    dispatch(createDoubt(obj)).then((res) => {
      if (res.msg == "Error") {
        setLoading(false);
        messageApi.open({
          type: "info",
          content: "Error",
          duration: 3,
        });
      } else {
        setLoading(false);
        onClose();
        return messageApi.open({
          type: "info",
          content: "Doubt posted",
          duration: 3,
        });
      }
    });
  };

  //cloudinary upload settings
  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary) {
        UploadRef.current = window.cloudinary;
        WidgetRef.current = UploadRef.current.createUploadWidget(
          {
            cloudName: "djib5oxng",
            uploadPreset: "djib5oxng",
            maxFiles: 1,
            clientAllowedFormats: ["jpg", "jpeg", "mp4"],
            maxFileSize: 52445000,
            thumbnailTransformation: [{ width: 240, height: 135, crop: "fill" }],
          },
          function (err, result) {
            if (result.info.secure_url) {
              setFileUrl(result.info.secure_url);
            }
            if (result.info.bytes) {
              setSize((result.info.bytes / 1000000).toFixed(3));
            }
            if (result.info.thumbnail_url) {
              setThumbnailUrl(result.info.thumbnail_url);
            }
            if (result.info.format) {
              setFileType(result.info.format);
            }
          }
        );
      } else {
        setTimeout(initializeUploadWidget, 100); // Retry after 100 milliseconds
      }
    };

    initializeUploadWidget();
  }, []);

  useEffect(() => {
    dispatch(getDoubtData(filterDoubt));
  }, [filterDoubt]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  return (
    <Navbar>
      <div className="content">
        <Header Title={"Doubts"} Address={"Doubts"} />

        {/* Filter by Class */}
        <select style={{ width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '20px', marginBottom: '10px' }} value={filterDoubt} onChange={(e) => setFilterDoubt(e.target.value)}>
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
        <h3>Unsolved Doubts</h3>
        <div className="contentData">
          {doubt
            ?.filter((elem) => elem.resolved == "No")
            .map((data, i) => {
              return <DoubtBox data={data} key={i} />;
            })}
        </div>
        <h3>Resolved Doubts</h3>

        <div className="contentData">
          {doubt
            ?.filter((elem) => elem.resolved == "Yes")
            .map((data, i) => {
              return <DoubtBox data={data} key={i} />;
            })}
        </div>

        <div onClick={showDrawer}>
          <AddIcon />
        </div>

        {/* drawer  */}
        <Drawer
          title="Create a new doubt"
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
          <form>
            <input
              placeholder="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleFormChange(e)}
            />
            <input
              placeholder="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => handleFormChange(e)}
            />
            <select name="class" onChange={(e) => handleFormChange(e)}>
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
            <select name="subject" onChange={(e) => handleFormChange(e)}>
              <option value="">Choose Subject</option>
              <option value="DBMS">DBMS</option>
          <option value="Operating System">Operating System</option>
          <option value="Bussiness Management">Bussiness Management</option>
          <option value="Biology">Biology</option>
          <option value="Political science">Political science</option>
          <option value="CBNST">CBNST</option>
            </select>
          </form>
          {size ? (
            <div className="uploadedImgDiv">
              <p>File Type : {fileType}</p>
              <p>File Size : {size} mb</p>
              <p>Thumbnail :</p>
              <img src={thumbnailUrl} alt="thumbnail" />
            </div>
          ) : (
            ""
          )}
          <button className="submitBtn" onClick={handleSubmit}>
            Add Doubt
          </button>

          {/* drawer loading indicator */}
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

        {/* main loading indicator  */}
        {contextHolder}
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

export default Doubts;
