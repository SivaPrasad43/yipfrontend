import React, { useState, useEffect } from "react"
import Select from "react-select"
import "./Setup.scss"
import setupImg from "../../assets/Kindergarten student-bro 1.png"
import apiGateway from "../../service/apiGateway"

interface SelectItemProps {
  item: string
  list: any
}

interface DistrictProps {
  id: string
  name: string
}

interface CollegeProps {
  id: string
  title: string
}


const ClubSetup = () => {
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [college, setCollege] = useState<CollegeProps[]>([])
  const [districtSelected, setDistrictSelected] = useState("")
  const [districtName, setDistrictName] = useState("")
  const [collegeSelected, setCollegeSelected] = useState("")
  const [collegeName, setCollegeName] = useState("")

const handleDistrict = (data: any) => {
  setDistrictSelected(data.id)
  console.log("dist selected : ", data)
  setDistrictName(data.name)
}

  useEffect(() => {
    const fetchData = async () => {
      apiGateway.get(`/api/v1/yip/district/`)
        .then(({ data }) => {
          const { districts } = data.response;
          console.log("districts-axios :", districts);
          setDistricts(districts);
        })
        .catch(error => console.error(error));
    }
    fetchData()
  }, [])

  useEffect(() => {
    const reqData: any = {
      district: districtName,
    }
    console.log(districtSelected)
    if (districtSelected) {
      const fetchData = async () => {
        apiGateway.post(`/api/v1/yip/list-colleges/`,reqData)
          .then(({ data }) => {
            const { institutions } = data.response;
            console.log("institutions-axios :", data.response);
            setCollege(institutions);
          })
          .catch(error => console.error(error));
      }
      fetchData()
    }
  }, [districtSelected])

  const sendData = (): any => {
    const postData: any = {
      club_name: collegeName,
      institute_type: "College",
      institute_id: collegeSelected,
      district_id: districtSelected,
    }
    const createData = async () => {
      apiGateway.post(`/api/v1/yip/create-college-club/`, postData)
        .then((response) => {
          console.log("axios-response :", response);
          window.location.reload()
        })
        .catch(error => console.error(error));
    }
    createData()
    console.log("data send!!")
  }

  return (
    <div className="white-container">
      <h3>Setup a new Club</h3>
      <div className="setup-club">
        <div className="setup-filter">
          <div className="select-container club">
            <div className="setup-item" id="district">
              <p>District</p>
              <Select
                options={districts}
                isSearchable={true}
                isClearable={true}
                placeholder={`Select a District`}
                getOptionValue={(option: any) => option.id}
                getOptionLabel={(option: any) => option.name}
                onChange={handleDistrict}
              />
            </div>
            <div className="setup-item" id="district">
              <p>College</p>
              <Select
                options={college}
                isSearchable={true}
                isClearable={true}
                placeholder={`Select a College`}
                getOptionValue={(option: any) => option.id}
                getOptionLabel={(option: any) => option.title}
                onChange={(data: any) => {
                  setCollegeSelected(data.id)
                  setCollegeName(data.title)
                  console.log(collegeName)
                }}
              />
            </div>
            <div className="create_btn_cntr">
              <button id="create_btn" className="black-btn" onClick={sendData}>
                Create
              </button>
            </div>
          </div>
        </div>
        {/* <div className="setup-img">
          <img src={setupImg} alt="HI" />
        </div> */}
      </div>
    </div>
  )
}

export default ClubSetup
