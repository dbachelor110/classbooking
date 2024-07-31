import React from 'react';
import { Checkbox } from "antd";

const ScheduleFilter: React.FC<{ name:string, onChange?:()=>void }> = ({ name, onChange }) => {
    return (
        <div className='scheduleFilter'>
            <Checkbox onChange={_e=>{onChange?onChange():{}}}>{name}</Checkbox>
        </div>
    );
}
export default ScheduleFilter;