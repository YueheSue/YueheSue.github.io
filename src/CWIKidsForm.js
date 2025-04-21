import React, { useState, useEffect } from 'react';
import './KidsFormPage.css'; 
import { Form, Input, Select, Radio, Button, Dialog } from 'element-react';
import CustomDatePicker from './components/CustomDatePicker';

// Validation functions
const validateIdNumber = (rule, value, callback) => {
  if (value && !/^[0-9X]{18}$/.test(value)) {
    callback(new Error('证件号格式不正确'));
  } else {
    callback();
  }
};

const validatePhone = (rule, value, callback) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};

function CWIKidsForm({ userInfo, onLogout }) {
  // Form data state
  const [form, setForm] = useState({
    childIdType: '居民身份证',
    contactPhone: '',
    relationship: '',
    childIdNumber: '',
    childName: '',
    childGender: '',
    childBirthDate: '',
    ageGroup: '',
    childResidence: '',
    fatherIdType: '',
    fatherName: '',
    fatherIdNumber: '',
    motherIdType: '',
    motherName: '',
    motherIdNumber: '',
    captchaImage: '',
    smsCode: ''
  });
  
  // Form fields from cwikids.json
  const [formFields, setFormFields] = useState({
    line1: {
      "幼儿证件类型": "居民身份证",
      "联系手机": "+86",
      "幼儿与在沪房产持有人关系": "请选择"
    },
    line2: {
      "幼儿证件号": "尾号字母必须为大写",
      "幼儿姓名": "请输入",
      "幼儿性别": "自动选择"
    },
    line3: {
      "幼儿出生日期": "自动填写",
      "学龄段": "自动选择",
      "幼儿户籍所在地": "请选择"
    },
    line4: {
      "父亲证件类型": "请选择",
      "父亲姓名": "请输入",
      "父亲证件号": "请输入"
    },
    line5: {
      "母亲证件类型": "请选择",
      "母亲姓名": "请输入",
      "母亲证件号": "请输入"
    },
    line6: {
      "图形验证": "图形验证码",
      "短信验证码": "4位验证码"
    }
  });
  
  // Load cwikids.json data
  useEffect(() => {
    const loadFormFields = async () => {
      try {
        const response = await fetch('/cwikids.json');
        const data = await response.json();
        setFormFields(data);
      } catch (error) {
        console.error('Error loading form fields:', error);
      }
    };
    
    loadFormFields();
  }, []);
  
  // Dialog and loading states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Handle form input changes
  const handleChange = (name, value) => {
    const newForm = {
      ...form,
      [name]: value
    };
    
    // Auto-fill based on ID number if it's a valid ID card number
    if (name === 'childIdNumber' && value && value.length === 18 && /^[0-9X]{18}$/.test(value)) {
      // Extract birth date from ID (format: YYYYMMDD is positions 7-14)
      const birthDateStr = value.substring(6, 14);
      const year = birthDateStr.substring(0, 4);
      const month = birthDateStr.substring(4, 6);
      const day = birthDateStr.substring(6, 8);
      
      // Create Date object
      const birthDate = new Date(`${year}-${month}-${day}`);
      
      // Extract gender from ID (odd = male, even = female)
      const genderCode = parseInt(value.charAt(16)) % 2;
      const gender = genderCode === 1 ? '男' : '女';
      
      // Calculate age and determine age group
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      let ageGroup = '';
      
      if (age < 3) {
        ageGroup = '托班';
      } else {
        ageGroup = '小班';
      }
      
      // Update form with extracted data
      newForm.childGender = gender;
      newForm.childBirthDate = birthDate;
      newForm.ageGroup = ageGroup;
      
      console.log('Auto-filled based on ID:', { gender, birthDate, ageGroup });
    }
    
    setForm(newForm);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!form.childIdNumber) errors.childIdNumber = '请输入幼儿证件号';
    if (!form.childName) errors.childName = '请输入幼儿姓名';
    if (!form.contactPhone) errors.contactPhone = '请输入联系手机';
    else if (!/^\d{11}$/.test(form.contactPhone)) errors.contactPhone = '请输入正确的手机号码';
    if (!form.fatherIdNumber) errors.fatherIdNumber = '请输入父亲证件号';
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setDialogVisible(true);
        console.log('Form submitted:', form);
      }, 1500);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setForm({
      childIdType: '居民身份证',
      contactPhone: '',
      relationship: '',
      childIdNumber: '',
      childName: '',
      childGender: '',
      childBirthDate: '',
      ageGroup: '',
      childResidence: '',
      fatherIdType: '',
      fatherName: '',
      fatherIdNumber: '',
      motherIdType: '',
      motherName: '',
      motherIdNumber: '',
      captchaImage: '',
      smsCode: ''
    });
    setFormErrors({});
    
    alert('表单已重置');
  };
  
  // Handle success dialog confirm
  const handleSuccessConfirm = () => {
    setDialogVisible(false);
    alert('表单提交成功');
  };
  
  // Auto-fill the form with test data
  const loadTestData = () => {
    setForm({
      childIdType: '居民身份证',
      contactPhone: '13812345678',
      relationship: '父亲',
      childIdNumber: '310101201001011234',
      childName: '张小明',
      childGender: '男',
      childBirthDate: new Date('2010-01-01'),
      ageGroup: '托班',
      childResidence: '上海',
      fatherIdType: '居民身份证',
      fatherName: '张大明',
      fatherIdNumber: '310101198001011234',
      motherIdType: '居民身份证',
      motherName: '李小芳',
      motherIdNumber: '310101198501011234',
      captchaImage: '1234',
      smsCode: '5678'
    });
  };
  
  return (
    <div className="form-fill-container">
      <header className="form-header">
        <h1>幼儿与在沪房表单</h1>
        {userInfo && (
          <div className="user-info">
            <span>欢迎, {userInfo.username || '用户'}</span>
            <button className="logout-btn" onClick={onLogout}>退出登录</button>
          </div>
        )}
      </header>
      
      <div className="form-content">
        <div className="form-tools">
          <button className="tool-btn" onClick={loadTestData}>加载测试数据</button>
        </div>
        
        {/* Display form errors if any */}
        {Object.keys(formErrors).length > 0 && (
          <div className="form-error">
            {Object.values(formErrors)[0]}
          </div>
        )}
        
        <Form className="registration-form" labelPosition="top" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item label="幼儿证件类型" prop="childIdType">
                <Select 
                  value={form.childIdType} 
                  placeholder={formFields.line1["幼儿证件类型"]}
                  onChange={val => handleChange('childIdType', val)}
                >
                  <Select.Option label="居民身份证" value="居民身份证" />
                  <Select.Option label="护照" value="护照" />
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="联系手机" 
                prop="contactPhone"
                rules={[
                  { required: true, message: '请输入联系手机', trigger: 'blur' },
                  { validator: validatePhone, trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.contactPhone} 
                  placeholder={formFields.line1["联系手机"]}
                  onChange={val => handleChange('contactPhone', val)}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item label="幼儿与在沪房产持有人关系" prop="relationship">
                <Select 
                  value={form.relationship} 
                  placeholder={formFields.line1["幼儿与在沪房产持有人关系"]}
                  onChange={val => handleChange('relationship', val)}
                >
                  <Select.Option label="父亲" value="父亲" />
                  <Select.Option label="母亲" value="母亲" />
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item 
                label="幼儿证件号" 
                prop="childIdNumber"
                rules={[
                  { required: true, message: '请输入幼儿证件号', trigger: 'blur' },
                  { validator: validateIdNumber, trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.childIdNumber} 
                  placeholder={formFields.line2["幼儿证件号"]}
                  onChange={val => handleChange('childIdNumber', val)}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="幼儿姓名" 
                prop="childName"
                rules={[
                  { required: true, message: '请输入幼儿姓名', trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.childName} 
                  placeholder={formFields.line2["幼儿姓名"]}
                  onChange={val => handleChange('childName', val)}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="幼儿性别" 
                prop="childGender"
                rules={[
                  { required: true, message: '请选择性别', trigger: 'change' }
                ]}
              >
                <Radio.Group value={form.childGender} onChange={val => handleChange('childGender', val)}>
                  <Radio value="男">男</Radio>
                  <Radio value="女">女</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item 
                label="幼儿出生日期" 
                prop="childBirthDate"
                rules={[
                  { required: true, message: '请选择出生日期', trigger: 'change' }
                ]}
              >
                <CustomDatePicker
                  value={form.childBirthDate}
                  placeholder={formFields.line3["幼儿出生日期"]}
                  onChange={val => handleChange('childBirthDate', val)}
                  className="full-width-datepicker"
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item label="学龄段" prop="ageGroup">
                <Select 
                  value={form.ageGroup} 
                  placeholder={formFields.line3["学龄段"]}
                  onChange={val => handleChange('ageGroup', val)}
                >
                  <Select.Option label="托班" value="托班" />
                  <Select.Option label="小班" value="小班" />
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item label="幼儿户籍所在地" prop="childResidence">
                <Select 
                  value={form.childResidence} 
                  placeholder={formFields.line3["幼儿户籍所在地"]}
                  onChange={val => handleChange('childResidence', val)}
                >
                  <Select.Option label="上海市" value="上海市" />
                  <Select.Option label="北京市" value="北京市" />
                  <Select.Option label="广东省" value="广东省" />
                  <Select.Option label="其他" value="其他" />
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item label="父亲证件类型" prop="fatherIdType">
                <Select 
                  value={form.fatherIdType} 
                  placeholder={formFields.line4["父亲证件类型"]}
                  onChange={val => handleChange('fatherIdType', val)}
                >
                  <Select.Option label="居民身份证" value="居民身份证" />
                  <Select.Option label="护照" value="护照" />
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="父亲姓名" 
                prop="fatherName"
                rules={[
                  { required: true, message: '请输入父亲姓名', trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.fatherName} 
                  placeholder={formFields.line4["父亲姓名"]}
                  onChange={val => handleChange('fatherName', val)}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="父亲证件号" 
                prop="fatherIdNumber"
                rules={[
                  { required: true, message: '请输入父亲证件号', trigger: 'blur' },
                  { validator: validateIdNumber, trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.fatherIdNumber} 
                  placeholder={formFields.line4["父亲证件号"]}
                  onChange={val => handleChange('fatherIdNumber', val)}
                />
              </Form.Item>
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item label="母亲证件类型" prop="motherIdType">
                <Select 
                  value={form.motherIdType} 
                  placeholder={formFields.line5["母亲证件类型"]}
                  onChange={val => handleChange('motherIdType', val)}
                >
                  <Select.Option label="居民身份证" value="居民身份证" />
                  <Select.Option label="护照" value="护照" />
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="母亲姓名" 
                prop="motherName"
                rules={[
                  { required: true, message: '请输入母亲姓名', trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.motherName} 
                  placeholder={formFields.line5["母亲姓名"]}
                  onChange={val => handleChange('motherName', val)}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="母亲证件号" 
                prop="motherIdNumber"
                rules={[
                  { required: true, message: '请输入母亲证件号', trigger: 'blur' },
                  { validator: validateIdNumber, trigger: 'blur' }
                ]}
              >
                <Input 
                  value={form.motherIdNumber} 
                  placeholder={formFields.line5["母亲证件号"]}
                  onChange={val => handleChange('motherIdNumber', val)}
                />
              </Form.Item>
            </div>
          </div>

          {/* Row 6 */}
          <div className="form-row">
            <div className="form-group">
              <Form.Item 
                label="图形验证码" 
                prop="captchaImage"
                rules={[
                  { required: true, message: '请输入图形验证码', trigger: 'blur' }
                ]}
              >
                <div className="captcha-container">
                  <Input 
                    value={form.captchaImage} 
                    placeholder={formFields.line6["图形验证"]}
                    onChange={val => handleChange('captchaImage', val)}
                    style={{ width: '65%' }}
                  />
                  <div className="captcha-image">
                    <img src="https://picsum.photos/100/32" alt="图形验证码" style={{ height: '32px', cursor: 'pointer' }} />
                  </div>
                </div>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item 
                label="短信验证码" 
                prop="smsCode"
                rules={[
                  { required: true, message: '请输入短信验证码', trigger: 'blur' }
                ]}
              >
                <div className="sms-container">
                  <Input 
                    value={form.smsCode} 
                    placeholder={formFields.line6["短信验证码"]}
                    onChange={val => handleChange('smsCode', val)}
                    style={{ width: '65%' }}
                  />
                  <Button type="primary" size="small" style={{ marginLeft: '8px' }}>
                    获取验证码
                  </Button>
                </div>
              </Form.Item>
            </div>

            <div className="form-group">
              {/* Empty cell for layout consistency */}
            </div>
          </div>

          <div className="form-actions">
            <Button type="primary" nativeType="submit" loading={loading}>提交</Button>
            <Button onClick={resetForm}>重置</Button>
          </div>
        </Form>
      </div>
      
      {/* Success Dialog */}
      <Dialog
        title="提交成功"
        visible={dialogVisible}
        onCancel={() => setDialogVisible(false)}
      >
        <Dialog.Body>
          <p>幼儿信息已成功提交！</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="primary" onClick={handleSuccessConfirm}>确定</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}

export default CWIKidsForm; 