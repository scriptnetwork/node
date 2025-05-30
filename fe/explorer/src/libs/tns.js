import TNS from 'tns-resolver';
import dotool from '../../dotool';

const endpoint = dotool.bridge_eth__URL;

const tns = new TNS({ customRpcEndpoint: endpoint });

export default tns;
