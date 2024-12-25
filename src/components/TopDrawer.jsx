import { Drawer } from 'antd';
import { getNamesAndValues } from '../utils/getNamesAndValues';

const TopDrawer = ({ visible, onClose ,data}) => {
const { names, values } = getNamesAndValues("Reson Branch", data);
  return (
    <Drawer
      title="Reason Branch"
      placement="left"
      closable={true}
      onClose={onClose}
      open={visible}
      height={400} 
    >
      <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
        <div className="space-y-1">
          {names.map((n, index) => (
            <p key={index} className="text-sm text-gray-800 font-medium">
              <span className="font-bold">{n}</span>: {values[index]}
            </p>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default TopDrawer;
