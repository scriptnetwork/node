import React, { Component } from 'react'
import { browserHistory } from "react-router";
import Chaindata from '../sections/Chaindata'
import NewBlocks from '../sections/NewBlocks';
import NewTransaction from '../sections/NewTransaction';
import { IoIosSearch } from "react-icons/io";
import dotool from '../../dotool';

 
 export default class Explorer extends Component {
      
    constructor(props) {
      super(props);
      this.state = {
        isNewExplore: true,
        currentPath: '/'
      };
      this.searchInput = React.createRef();
      this.changePageLayout = this.changePageLayout.bind(this);
      this.getTabName = this.getTabName.bind(this);
    }
    changePageLayout() {
      const path = window.location.pathname;
      this.getTabName(path);
      console.log(path);
      if (path === "/") {
        this.setState({ isNewExplore: true });
      } else {
        this.setState({ isNewExplore: false });
      }
    }

    getTabName(path) {
      switch (path) {
       
        case "/stakes":
          this.setState({
            currentPath: 'Stakes'
          })
          return;
        case "/tokens":
            this.setState({
              currentPath: 'Tokens'
            })
            return;
        case "/txs": 
          this.setState({
            currentPath: 'Transactions'
          })
          return;
        case "/blocks":
          this.setState({
            currentPath: 'Blocks'
          })
          return;
        default:
          if(path.includes('/blocks/')) {
            this.setState({
              currentPath: 'Block Detail'
            })
          } else {
            this.setState({
              currentPath: ''
            })
          }
          return;
      }
    }

    handleEnterKey(e) {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    }
  
    handleSearch() {
       
      const value = this.searchInput.value;
      if (value !== "") {
        if (value.trim().startsWith("0x")) {
          if (value.trim().length === 42) {
            browserHistory.push(`/account/${value}`);
          }
          if (value.trim().length === 66) {
            browserHistory.push(`/txs/${value}`);
          }
        } else {
          browserHistory.push(`/blocks/${value}`);
        }
        this.searchInput.value = "";
      }
      // this.props.toggleLayout();
      this.changePageLayout();
    }
   
  

   render() {
    const { t } = this.props;
    const version = dotool.system_version;
    const title = `${version} Explorer ${dotool.ss_network}`;

     return (
      <>
       <div className='main-explorer' >
            
            {/* <Navbar2  toggleLayout={this.changePageLayout} /> */}

            <div className='Explorer-input'>
                <div>
                {title}
                </div>
                <img src='images/shadowImage.png' className='shadow'/>

                <div className='explorer-input-wrapper'>
                   <IoIosSearch color='#747474' size={27} className='search-icon'/>
                    {/* <img src='/images/search-icon.png'/> */}
                   <input 
                   type='text' 
                   placeholder='Search for a transition, block, address, time or height'
                   onKeyPress={(e) => this.handleEnterKey(e)}
                   ref={(input) => (this.searchInput = input)}
                   />
                </div>



            </div>

            <div className='chain-data'>
                 Chain Data
            </div>
            
            <Chaindata/>

            <div className='BT-wrapper'>

              <NewBlocks/>

              <NewTransaction/>

            </div>
  
       </div>

       {/* <div className='footer-style-explore' >
          <Footer/>          
      </div>                              */}
     </>
     )
   }
 }
 
