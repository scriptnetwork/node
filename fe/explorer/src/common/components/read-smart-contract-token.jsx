import React, { useState, useRef, useEffect } from "react";
import get from 'lodash/get';
import map from 'lodash/map';
import merge from 'lodash/merge';
import { ethers } from "ethers";
import smartContractApi from '../services/smart-contract-api';
import Theta from '../../libs/Theta';
import ThetaJS from '../../libs/thetajs.esm'

export const ReadSmartContractToken = (props) => {
    const { functionData, index, address, abi } = props;
    const inputs = get(functionData, 'inputs');
    const outputs = get(functionData, 'outputs');
    const [callResult, setCallResult] = useState(null);
    const [inputValues, setInputValues] = useState(new Array(inputs.length));
    const decodedParameters = get(callResult, 'decodedParameters');
    const hasInput = inputs.length > 0 || false;
    const vm_error = get(callResult, 'vm_error');
  
    async function fetchFunction() {
      const iface = new ethers.utils.Interface(abi || []);
      const senderSequence = 1;
      const functionInputs = get(functionData, ['inputs'], []);
      const functionOutputs = get(functionData, ['outputs'], []);
      const functionSignature = iface.getSighash(functionData.name)
  
      const inputTypes = map(functionInputs, ({ name, type }) => {
        return type;
      });
      try {
        var abiCoder = new ethers.utils.AbiCoder();
        var encodedParameters = abiCoder.encode(inputTypes, inputValues).slice(2);;
        const gasPrice = Theta.getTransactionFee(); //feeInTFuelWei;
        const gasLimit = 2000000;
        const data = functionSignature + encodedParameters;
        const tx = Theta.unsignedSmartContractTx({
          from: address,
          to: address,
          data: data,
          value: 0,
          transactionFee: gasPrice,
          gasLimit: gasLimit
        }, senderSequence);
        const rawTxBytes = ThetaJS.TxSigner.serializeTx(tx);
        const callResponse = await smartContractApi.callSmartContract({ data: rawTxBytes.toString('hex').slice(2) }, { network: Theta.chainId });
        const callResponseJSON = await callResponse.json();
        const result = get(callResponseJSON, 'result');
        let outputValues = get(result, 'vm_return');
        const outputTypes = map(functionOutputs, ({ name, type }) => {
          return type;
        });
        outputValues = /^0x/i.test(outputValues) ? outputValues : '0x' + outputValues;
        setCallResult(merge(result, {
          outputs: functionOutputs,
          decodedParameters: abiCoder.decode(outputTypes, outputValues)
        }));
      }
      catch (e) {
        console.log('error occurs:', e)
        //Stop loading and put the error message in the vm_error like it came fromm the blockchain.
        setCallResult({ vm_error: e.message })
      }
    }
    const onBlur = (e, i) => {
      let val = e.target.value;
      let type = inputs[i].type;
      let newVals = inputValues.slice();
      newVals[i] = val;
      setInputValues(newVals);
    }
  
    const onSubmit = () => {
      fetchFunction();
    }
  
    useEffect(() => {
      if (inputs.length === 0) fetchFunction();
    }, [])
    return (<div style={{marginRight: '20px'}}>
      <div>
        {hasInput &&
          <>
            <div>
              {outputs.map((output, i) => <span key={i}>{(i == 0 ? '' : ', ') + output.name}
              {/* <i>{output.type}</i> */} 0
              </span>)}
            </div>
          </>}
        {decodedParameters && !hasInput &&
          <div>
            {outputs.map((output, i) =>
              <div key={i} style={{display: "flex", flexDirection: "row", background: "none"}}>
                <div style={{marginRight: '10px'}}>{decodedParameters[i].toString()}</div>
                {/* <div>{output.type}</div> */}
              </div>)}
          </div>}
        {decodedParameters && hasInput &&
          <div>
            {outputs.map((output, i) =>
              <div key={i}>
                <div>
                  <span >&#8658;</span>
                  {`${output.name}
                  ${output.type}:
                  ${decodedParameters[i]}`}
                </div>
              </div>)}
          </div>}
      </div>
    </div>)
  }