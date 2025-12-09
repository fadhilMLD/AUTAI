import React from 'react';

interface ParameterControlProps {
    label: string;
    value: number | string;
    onChange: (value: number | string) => void;
    type?: 'number' | 'text' | 'select';
    options?: string[];
}

const ParameterControl: React.FC<ParameterControlProps> = ({ label, value, onChange, type = 'number', options }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = type === 'number' ? Number(event.target.value) : event.target.value;
        onChange(newValue);
    };

    return (
        <div className="parameter-control">
            <label>{label}</label>
            {type === 'select' ? (
                <select value={value} onChange={handleChange}>
                    {options?.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

export default ParameterControl;