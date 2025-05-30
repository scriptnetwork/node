import React, { Component } from 'react'
import { blocksService } from '../common/services/block'
import { age } from '../common/helpers/blocks';
import { Link } from 'react-router';
const MAX_BLOCKS = 50;

export default class NewBlocks extends Component {
     
    constructor(props) {
        super(props);
        this.state = {
        //   backendAddress: this.props.route.backendAddress,
          blockHeight: 0,
          blockInfoList: [],
          currentPageNumber: 1,
          totalPageNumber: 0
        };
        this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
        // this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this);
      }

      
        componentDidMount() {
            console.log("component mounted");
            const { currentPageNumber } = this.state;
            blocksService.getBlocksByPage(currentPageNumber, MAX_BLOCKS)
            .then(res => {
                this.receivedBlocksEvent(res);
            }).catch(err => {
                console.log(err);
            })
        }
        
        receivedBlocksEvent(data) {
            if (data.data.type == 'block_list') {
                console.log("inside======>");
                this.setState({
                    blockInfoList: data.data.body,
                    currentPageNumber: data.data.currentPageNumber,
                    totalPageNumber: data.data.totalPageNumber
                })
            }
        }
        
        render() {
            const { blockInfoList } = this.state;
            // console.log("data   =======>",blockInfoList);

    return (
        <div className='blocks'> 
                  
                <div className='block-heading'>
                    <div>Blocks</div>
                    <button><Link to={`/blocks`} className='view-all'>View all</Link></button>
               </div>

                <div className='main-block-wrapper'>
                         <div className='inner-heading'><span>Height/Time</span><span>Proposer/TXS</span></div>
                        <p></p>
                         <div className='data-overflow'>
                        {
                        blockInfoList.sort((a,b)=> b.height - a.height).map(b=>{
                            return <div className='data-wrapper' key={b.height}>
                            <div className='first'>
                                <div>{b?.height}</div> <div>{age(b)}</div>
                            </div>
                            <div className='second'>
                                <div><img src='/images/new-logo.svg'/><div>Script Network Staking</div></div>
                                <div>{b?.num_txs} TXS</div>
                            </div>
                        </div>
                        })
                        }
                        </div>
                </div>

      </div>
    )
  }
}
