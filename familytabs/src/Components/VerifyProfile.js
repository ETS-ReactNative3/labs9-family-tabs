import React, { Component } from "react";
import axios from "axios";
import { Link,Redirect } from "react-router-dom";


class VerifyProfile extends Component {
  state = {
    error: "",
    name: "",
    email: "",
    userEmail: "",
    userName: "",
    family_name: "",
    phone: ""
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  familySubmitHandle = async e => {
    e.preventDefault();
    let userResponse;
    if (!this.state.family_name) {
      return;
    }
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/family/create`,
        {
          family_name: this.state.family_name
        }
      );
      console.log(response.data[0])
      userResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/newlogin`,
        {
          userName: this.state.userName,
          email: this.state.userEmail,
          familyID: response.data[0].id,
          isAdmin: 1,
          phone: this.state.phone
        }
      );
      console.log(userResponse.data)
      this.props.setProfile({ profile: userResponse.data });
      return
    } catch (err) {
      console.log(userResponse.data, "no bueno");
    }
  };

  componentDidMount() {
    this.loadAPIProfile();
  }

  loadAPIProfile() {
    this.props.auth.getProfile(async (profile, error) => {
      let { email = profile.email.toLowerCase(), name } = profile;
      this.setState({ userEmail: email, userName: name });
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_API_URL}/profile/${this.state.userEmail}`
        );
        console.log(response.data)
        if (response.data.err){
          return
        }
        this.props.setProfile(response.data)
        this.props.setFamilyID(response.data.id)
      } catch (err) {
        console.log(err);
      }
      
    });
  }

  render() {
   
    return (
      <>
       

        {this.props.profile ? (<Redirect to='/home'></Redirect>
        ) : (
          <form onSubmit={this.familySubmitHandle}>
            <h1>Register Family</h1>
            <label>family name</label>
            <input
              type="text"
              name="family_name"
              placeholder="family name"
              value={this.state.family_name}
              onChange={this.handleChange}
            />
            <label>name</label>
            <input
              type="text"
              name="userName"
              placeholder="name"
              value={this.state.userName}
              onChange={this.handleChange}
            />
            <label>phone</label>
            <input
              type="text"
              name="phone"
              placeholder="phone"
              value={this.state.phone}
              onChange={this.handleChange}
            />
            <button type="submit">Submit</button>
          </form>
        )}

        {/* it's ugly so we don't forget to remove it */}
        
<div style={{fontSize: '50px', width:'922px', padding:'29px', background:'green', margin:'50px auto', textAlign:'center', border:'red solid 5px'}}>
  <Link  to='/home/tabs'>Dev mode backdoor for skipping database interaction</Link>

</div>
      </>
    );
  }
}

export default VerifyProfile;
