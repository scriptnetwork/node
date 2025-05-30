import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Breadcurmb extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const {path} = this.props;
        return (
            <>
                <div className="breadcrumb-wrapper">
                    <p className="current-page">
                        {path}
                    </p>
                    {/* <p className="current-version">
                        beta v.0.0.1
                    </p> */}
                </div>
            </>
        )
    }
}

export default withTranslation()(Breadcurmb);
