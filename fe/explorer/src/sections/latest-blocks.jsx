import React, { Component } from "react";
import { Link } from "react-router";
import { blocksService } from 'common/services/block';
import BlocksTable from "common/components/blocks-table";
import Pagination from "common/components/pagination";
import { withTranslation } from "react-i18next";
import {age,hash} from 'common/helpers/blocks'
const MAX_BLOCKS = 50;

class LatestBlocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockHeight: 0,
      blockInfoList: [],
      currentPageNumber: 1,
      totalPageNumber: 0
    };
    this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
    this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this);
  }

  componentDidMount() {
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
      this.setState({
        blockInfoList: data.data.body,
        currentPageNumber: data.data.currentPageNumber,
        totalPageNumber: data.data.totalPageNumber
      })
    }
  }
  handleGetBlocksByPage(pageNumber) {
    blocksService.getBlocksByPage(pageNumber, MAX_BLOCKS)
      .then(res => {
        this.receivedBlocksEvent(res);
      }).catch(err => {
        console.log(err);
      })
  }
  render() {
    const { blockInfoList } = this.state;
    const topBlocks = [];
    const { t } = this.props;
    let { currentPageNumber, totalPageNumber } = this.state;
    if(blockInfoList && blockInfoList.length) {
      blockInfoList.sort((a,b) => b.height - a.height).forEach((block, index) => {
        if(index < 5) {
          topBlocks.push(block);
        }
      })
    }
    currentPageNumber = Number(currentPageNumber);
    totalPageNumber = Number(totalPageNumber);
    return (
      <div className="">
        {topBlocks.map(top=>(
          <div className="singleBlock">
            <div className="d-flex justify-content-between top">
              <h3>{top.height}</h3><small> {age(top)}</small>
            </div>
            <div className="name"><Link to={`/blocks/${top.height}`}>{hash(top, true)}</Link></div>
          </div>
        ))}
        {/* <BlocksTable
          blocks={topBlocks}
          truncate={70} /> */}
        {/* <Pagination
          size={'lg'}
          totalPages={totalPageNumber}
          currentPage={currentPageNumber}
          onPageChange={this.handleGetBlocksByPage}
        /> */}
      </div>
    );
  }
}

export default withTranslation() (LatestBlocks)
