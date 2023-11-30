import React, { useState, useEffect } from 'react';
import './App.css';
import AWS from 'aws-sdk';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    grade: '',
    feedback: '',
    selectedOptions: [],
  });

  const [grades, setGrades] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // 학년 데이터 가져오기 (DynamoDB 또는 다른 데이터 소스에서 가져옴)
    const dummyGrades = ['1학년', '2학년', '3학년', '4학년'];
    setGrades(dummyGrades);

    // 학과 데이터 가져오기 (DynamoDB 또는 다른 데이터 소스에서 가져옴)
    const dummyDepartments = [
      '스마트소프트웨어학과',
      '전기전자공학과',
      '스마트전기전자공학과',
      '기계공학과',
      '스마트기계공학과',
    ];
    setDepartments(dummyDepartments);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const updatedOptions = checked
        ? [...formData.selectedOptions, value]
        : formData.selectedOptions.filter((option) => option !== value);

      setFormData({ ...formData, selectedOptions: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    // 필수 입력 필드가 비어있을 경우
    if (
      formData.name === '' ||
      formData.department === '' ||
      formData.grade === '' ||
      formData.selectedOptions.length === 0 ||
      formData.feedback === ''
    ) {
      alert('모든 필수 항목을 입력하세요.');
    } else {
      try {
        // AWS SDK 설정
        AWS.config.update({
          region: 'your-dynamodb-region',
          accessKeyId: 'your-access-key-id',
          secretAccessKey: 'your-secret-access-key',
        });

        // DynamoDB DocumentClient 생성
        const docClient = new AWS.DynamoDB.DocumentClient();

        // DynamoDB에 데이터 쓰기
        const params = {
          TableName: 'SurveyResponses', // 이전에 생성한 테이블 이름
          Item: {
            UserId: 'unique-user-id', // 고유한 사용자 ID (예: 세션 또는 인증에서 제공)
            Name: formData.name,
            Department: formData.department,
            Grade: formData.grade,
            Feedback: formData.feedback,
            SelectedOptions: formData.selectedOptions,
          },
        };

        await docClient.put(params).promise();
        alert('제출했습니다.');
      } catch (error) {
        console.error('Error submitting data to DynamoDB', error);
        alert('데이터 제출 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <h1>간단한 설문조사</h1>
      <form>
        <label htmlFor="name">이름:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="department">학과:</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">선택하세요</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select><br />

        <label htmlFor="grade">학년:</label>
        <select
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
        >
          <option value="">선택하세요</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select><br />
        <hr />
        <h4>선호하는 음식을 골라주세요</h4>
        <label>짜장면</label>
        <input
          type="checkbox"
          id="option1"
          name="selectedOptions"
          value="Option 1"
          onChange={handleChange}
        />

        <label>짬뽕</label>
        <input
          type="checkbox"
          id="option2"
          name="selectedOptions"
          value="Option 2"
          onChange={handleChange}
        />

        <label>볶음밥</label>
        <input
          type="checkbox"
          id="option3"
          name="selectedOptions"
          value="Option 3"
          onChange={handleChange}
        />
        <hr />

        <label htmlFor="feedback">의견을 공유해주세요:</label>
        <br />
        <textarea
          id="feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          rows="4"
          cols="50"
          required
        ></textarea><br />

        <button type="button" onClick={handleSubmit}>
          제출
        </button>
      </form>
    </div>
  );
};

export default App;
