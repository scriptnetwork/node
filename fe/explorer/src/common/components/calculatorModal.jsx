
import React, { Component, useState } from "react";
import {stakingCalc} from '../helpers/utils'
export default class CalculatorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 10000,
      rate: 13.5,
      year:12,
      frequency:'yearly',
      marketValues:{
        circInPercent:0,
        spayPriceUSD:0,
        scptPriceUSD:0
      },
      stakingCalcResultDaily:{
        interest:0,
        stakingInterval:[],
        amount:0
      },
      stakingCalcResultMonthly:{
        interest:0,
        stakingInterval:[],
        amount:0
      },
      stakingCalcResultYearly:{
        interest:0,
        stakingInterval:[],
        amount:0
      }
    }
  }
  componentDidMount(){
    this.calculateRewards()
  }
   checkAmount = (e) => {
    this.setState({amount:e.target.value,
      circInPercent: (parseInt(e.target.value) / 1000000000) * 100,
      spayPriceUSD: 0.005,
      scptPriceUSD: 0.01
    });
   
  }
  componentDidUpdate(prevProps, prevState) {
    // Check if a specific variable has changed
    if (this.state.amount !== prevState.amount ||this.state.year !== prevState.year||this.state.rate !== prevState.rate) {
      // Run the function when the variable changes
      this.calculateRewards();
    }
  }
  closeModal=()=>{
    console.log('close')
    this.props.closeModal();
  }


   calculateRewards = () => {
    if (!this.state.year) {
      // ToastMessage('Please enter year');
      return;
    }

    if (!this.state.rate) {
      // ToastMessage('Please enter rate of interest');
      return;
    }

    if (!this.state.amount) {
      // ToastMessage('Please enter staking amount');
      return;
    }
    this.setState({stakingCalcResultDaily:stakingCalc.dailyCalc(this.state.amount, this.state.rate, this.state.year)})
    this.setState({stakingCalcResultMonthly:stakingCalc.monthlyCalc(this.state.amount, this.state.rate, this.state.year)})
    this.setState({stakingCalcResultYearly:stakingCalc.yearlyCalc(this.state.amount, this.state.rate, this.state.year)})

    // switch (this.state.frequency) {
    //   case "daily":
    //     this.setState({stakingCalcResultDaily:stakingCalc.dailyCalc(this.state.amount, this.state.rate, this.state.year)})
    //     break;

    //   case "weekly":
    //     this.setState(stakingCalc.weeklyCalc(this.state.amount, this.state.rate, this.state.year))
    //     break;

    //   case "monthly":
    //     this.setState({stakingCalcResultMonthly:stakingCalc.monthlyCalc(this.state.amount, this.state.rate, this.state.year)})
    //     break;

    //   case "yearly":
    //     this.setState({stakingCalcResultYearly:stakingCalc.yearlyCalc(this.state.amount, this.state.rate, this.state.year)})
    //     break;

    //   default:
    //     break;
    // }
  }

   checkRate = (e) => {
    this.setState({rate:e.target.value})
  }

   checkYear = (e) => {
    this.setState({year:e.target.value})
  }

   handleSlider = (e, type) => {
    if(type === 'duration') {
      this.checkYear(e)
    }

    if(type === 'rate') {
      this.checkRate(e);
    }
    if(type==='amount'){
      this.checkAmount(e)
    }
  }
render({
  amount,
  rate,
  year,
  stakingCalcResultDaily,
  stakingCalcResultMonthly,
  stakingCalcResultYearly,
}=this.state){
  return (
  <>
      <div className="mb-12 ">
        <div className="mb-4">
          <h1 className="text-center text-primary " style={{fontSize:'1.875rem',fontWeight:'800'}}> 
            Script (SCPT) staking calculator
          </h1>
          <a onClick={this.closeModal} className="close-btn">&times;</a>
        </div>

        <h4 className="heading-sub text-center text-white">
            Calculate your Script staking rewards
        </h4>
      </div>

      <div className=" calc-section">
        <div className="grid gap-4 lg:gap-4 lg:grid-cols-1 items-center mb-5 ">
           
                <div className="d-flex justify-content-between mt-2">
      <div>
        <label
          htmlFor="amount"
          className="block fs-16px font-semibold text-white cursor-pointer w-fit"
        >
         Staking Amount
        </label>
        {/* <input
          type="number"
          id="amount"
          value={amount}
          name="amount"
          placeholder="0"
          className={`h-[40px] lg:h-[40px] bg-primary flex items-center px-4  fs-16px font-semibold rounded w-full outline-none`}
          onChange={this.checkAmount}
        /> */}
        <p className="amount bold-value">{amount}</p>
        </div>
        <div>
        <label className="block fs-16px font-semibold text-white cursor-pointer w-fit" >apr</label>
        <p className="apy-rate bold-value">+{rate}%</p>
      </div>
     </div>
      <input
                id="percentage-range"
                type="range"
                value={amount}
                className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                min="1000"
                max="10000"
                step="1000"
                onChange={(e) => {
                  this.handleSlider(e, 'amount')
                }}
              />

              <div className="d-flex justify-content-between align-items-center border-bottom mt-2">
                <h3>Daily Returns</h3> 
                <div className="result-amt">
                  <p>{(+stakingCalcResultDaily.interest).toFixed(3)} SPY</p>
                  <span> ${(+stakingCalcResultDaily.interest * 0.0005).toFixed(3)}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom">
                <h3>Monthly Returns</h3> 
                <div  className="result-amt">
                  <p>{(+stakingCalcResultMonthly.interest).toFixed(3)} SPY</p>
                  <span> ${(+stakingCalcResultMonthly.interest * 0.0005).toFixed(3)}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom">
                <h3>Yearly Returns</h3> 
                <div className="result-amt">
                  <p>{(+stakingCalcResultYearly.interest).toFixed(3)} SPY</p>
                  <span> ${(+stakingCalcResultYearly.interest * 0.0005).toFixed(3)}</span>
                </div>
              </div>
  
            {/* <SelectGroup
                label="Reward frequency"
                id="frequency"
                changeFrequency={changeFrequency}
            /> */}
            {/* <div className="my-5">
            
                         <div className="grid  lg:gap-0 lg:grid-cols-1 items-center">
      <div>
        <label
          htmlFor="amount"
          className="block fs-16px font-semibold text-white cursor-pointer w-fit"
        >
         Estimated Interest Rate (% APY):
        </label>
      </div>
      <div>
        <input
          type="text"
          id="rate"
          value={`${rate} %`}
          name="rate"
          
          readOnly={true}
          className={`h-[40px] lg:h-[40px] bg-primary flex items-center px-4 lg:px-5 fs-16px font-semibold rounded-lg w-full outline-none`}
         
        />
      </div>
    </div>
              <input
                id="percentage-range"
                type="range"
                value={rate}
                className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                min="1"
                max="150"
                step="0.5"
                onChange={(e) => {
                  this.handleSlider(e, 'rate')
                }}
              />
            </div>
        
                                 <div className="grid  lg:gap-0 lg:grid-cols-1 items-center">
      <div>
        <label
          htmlFor="year"
          className="block fs-16px font-semibold text-white cursor-pointer w-fit"
        >
         Length of Time in Months:
        </label>
      </div>
      <div>
        <input
          type="text"
          id="year"
          
          value={`${year} months`}
          name="year"
          readOnly={true}
          className={`h-[40px] lg:h-[40px] bg-primary flex items-center px-4 lg:px-5 fs-16px font-semibold rounded-lg w-full outline-none`}
         
        />
      </div>
      <input
              id="year-range"
              type="range"
              value={year}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              min="1"
              max="120"
              step="1"
              onChange={(e) => {
                this.handleSlider(e, 'duration')
              }}
            />
    </div> */}
            
        </div>
        {/* <div className="grid gap-4 lg:gap-4 lg:grid-cols-1 items-center mb-5 w-50">
            <div className="flex flex-col items-center justify-center">
              <p className="text-white text-lg font-bold text-center">
                Total Reward Earned:
              </p>
              <p className="text-white text-lg text-center mt-5">
                <span className="font-bold text-300 mr-2">
                  {stakingCalcResultDaily.interest}
                </span>
                <span className="text-lg">
                  SPAY
                </span>
              </p>
              <p className="text-center mt-2">
                ${+stakingCalcResultDaily.interest * 0.0005}
              </p>
            </div>
        </div> */}

        {/* <div className="grid lg:grid-cols-1">
          <div></div>
          <div className="flex justify-center mt-8">
            <Button
              label="Calculate earnings"
              buttonProps={{
                onClick: () => {
                  calculateReward()
                },
              }}
            />
          </div>
        </div> */}
      </div>
  </>
  );
      }
}

