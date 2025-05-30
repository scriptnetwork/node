var helper = require('./utils');

exports.updateStake = async function (candidate, type, stakeDao) {
  const holder = candidate.Holder;
  const stakes = candidate.Stakes;
  // console.log("update stake---->>>>", candidate, type)
  let insertList = [];
  stakes.forEach(stake => {
    const stakeInfo = {
      'type': type,
      'holder': holder,
      'source': stake.source,
      'amount': stake.amount,
      'withdrawn': stake.withdrawn,
      'return_height': stake.return_height
    }
    insertList.push(stakeDao.insertAsync(stakeInfo));
  });
  await Promise.all(insertList);
}

exports.updateTotalStake = function (totalStake, progressDao) {
  let total = 0;
  let holders = new Set();
  if (Array.isArray(totalStake.vcp)) {
    totalStake.vcp.forEach(vcpPair => {
      vcpPair.Vcp.SortedCandidates.forEach(candidate => {
        holders.add(candidate.Holder)
        candidate.Stakes.forEach(stake => {
          total = helper.sumCoin(total, stake.amount)
        })
      })
    })
  }
  if (Array.isArray(totalStake.gcp)) {
    // console.log("totalStake.gcp", JSON.stringify(totalStake.gcp))
    totalStake.gcp.forEach(gcpPair => {
      // console.log("totalStake.gcp.gcpPair", JSON.stringify(gcpPair))
      // console.log("totalStake.gcp.gcpPair.Gcp", JSON.stringify(gcpPair.Gcp))
      if (Array.isArray(gcpPair.Gcp.SortedLightnings)) {
        gcpPair.Gcp.SortedLightnings.forEach(candidate => {
          holders.add(candidate.Holder)
          candidate.Stakes.forEach(stake => {
            total = helper.sumCoin(total, stake.amount)
          })
        })
      }
    })
  }
  totalStake.eenp && totalStake.eenp.forEach(eenpPair => {
    eenpPair.EENs.forEach(candidate => {
      holders.add(candidate.Holder);
      candidate.Stakes.forEach(stake => {
        total = helper.sumCoin(total, stake.amount)
      })
    })
  })
  progressDao.upsertStakeProgressAsync(total.toFixed(), holders.size);
}