import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts"
import moment from "moment";

const ApexCharts = ({filterOption,txTs, data}) => {

    const [apexChartData, setApexChartData] = useState({
        series: [
            {
                name: '',
                data: [31, 40, 28, 51, 42, 109, 100]
            },
        ],
        options: {
            chart: {
                height: 200,
                type: 'area',
                fontFamily: 'Outfit, sans-serif',
                foreColor: '#ffffff',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false,
            },
            colors: ['#ffef00'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false
                },
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
            tooltip: {
                theme: true,
                x: {
                    format: 'dd.MM.yyyy, HH:mm:ss'
                },
            },
        }  
    })


    const updateApexChartData = () => {
        console.log(txTs)
        setApexChartData({
            series: [{
                name: '',
                data: data
            }],
            options: {
                ...apexChartData.options,
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeUTC: false,
                        format:filterOption=='Yearly'?'dd MMM yy':filterOption=='Day'?'HH:mm':'dd MMM'
                    },
                    convertedCatToNumeric: false,
                    categories: txTs
                },
            }
        })
    }

    useEffect(() => {
        if(txTs.length && data.length) {
            updateApexChartData(txTs, data);
        }
        
    }, [txTs, data])


    return (
        <div id="chart">
            {
                txTs.length && data.length ? <ReactApexChart options={apexChartData.options} series={apexChartData.series} type="area" height={230} /> : null
            }
        </div>
    )
}


export default ApexCharts;