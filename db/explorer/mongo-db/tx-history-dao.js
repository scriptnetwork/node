//------------------------------------------------------------------------------
//  DAO for txHistory
//------------------------------------------------------------------------------

module.exports = class TxHistoryDAO {
  constructor(execDir, client) {
    this.client = client;
    this.txHistoryInfoCollection = "txHistory";
    this.blockInfoCollection = "block";
  }

  insert(txHistoryInfo, callback) {
    this.client.insert(this.txHistoryInfoCollection, txHistoryInfo, callback);
  }

  getAllTxHistory(callback) {
    this.client.findAll(
      this.txHistoryInfoCollection,
      function (error, recordList) {
        if (error) {
          console.log("ERR - ", error, height);
          // callback(error);
        } else if (!recordList || !recordList.length) {
          callback(Error("NOT_FOUND - Transaction History."));
        } else {
          callback(error, recordList);
        }
      }
    );
  }

  removeAll(callback) {
    this.client.remove(this.txHistoryInfoCollection, function (err, res) {
      if (err) {
        console.log("ERR - ", err, height);
        callback(err);
      }
      callback(err, res);
    });
  }

  getAllTxHistoryByHr(callback) {
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60);
    console.log(twentyFourHoursAgo.getTime());
    let queryObject = [
      {
        $match: {
          $expr: {
            $gte: [
              {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
              new Date(new Date() - 24 * 60 * 60 * 1000),
            ],
          },
        },
      },
      {
        $project: {
          year: {
            $year: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          month: {
            $month: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          day: {
            $dayOfMonth: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          hour: {
            $hour: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          num_txs: 1,
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            day: "$day",
            hour: "$hour",
          },
          num_txs: {
            $sum: "$num_txs",
          },
        },
      },
      {
        $addFields: {
          timestamp_unix: {
            $toDate: {
              $concat: [
                {
                  $toString: "$_id.year",
                },
                "-",
                {
                  $toString: "$_id.month",
                },
                "-",
                {
                  $toString: "$_id.day",
                },
                "T",
                {
                  $toString: "$_id.hour",
                },
                ":00:00Z",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          timestamp_unix: {
            $toLong: "$timestamp_unix",
          },
          num_txs: 1,
        },
      },
      {
        $sort: {
          timestamp_unix: 1,
        },
      },
    ];
    // console.log("query obj", queryObject)

    this.client.aggregateQuery(
      this.blockInfoCollection,
      queryObject,
      function (error, record) {
        if (error) {
          console.log("ERR - ", error);
        } else {
          // console.log('Calling get total number of txs, returns:', record)
          callback(error, record);
        }
      }
    );
  }
  getAllTxHistoryByFilter(filterOptions, callback) {
    console.log(filterOptions);
    let timeDuration = 24 * 60 * 60 * 1000;
    let groupBy = {
      day: "$day",
      month: "$month",
      year: "$year",
      hour: "$hour",
    };
    if (filterOptions == "Week") {
      timeDuration = 7 * timeDuration;
      groupBy = { day: "$day", month: "$month", year: "$year" };
    } else if (filterOptions == "Monthly") {
      timeDuration = 30 * timeDuration;
      groupBy = { day: "$day", month: "$month", year: "$year" };
    } else if (filterOptions == "Yearly") {
      timeDuration = 365 * timeDuration;
      groupBy = { month: "$month", year: "$year" };
    } else if (filterOptions == "Quarterly") {
      timeDuration = 91 * timeDuration;
      groupBy = { day: "$day", month: "$month", year: "$year" };
    }
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60);
    console.log(twentyFourHoursAgo.getTime());
    let queryObject = [
      {
        $match: {
          $expr: {
            $gte: [
              {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
              new Date(new Date() - timeDuration),
            ],
          },
        },
      },

      {
        $project: {
          month: {
            $month: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          year: {
            $year: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          day: {
            $dayOfMonth: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          hour: {
            $hour: {
              date: {
                $toDate: {
                  $multiply: [
                    1000,
                    {
                      $toInt: "$timestamp",
                    },
                  ],
                },
              },
            },
          },
          num_txs: 1,
        },
      },
      {
        $group: {
          _id: groupBy,
          num_txs: { $sum: "$num_txs" },
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ];
    // console.log("query obj", queryObject)

    this.client.aggregateQuery(
      this.blockInfoCollection,
      queryObject,
      function (error, record) {
        if (error) {
          console.log("ERR - ", error);
        } else {
          // console.log('Calling get total number of txs, returns:', record)
          callback(error, record);
        }
      }
    );
  }
};
