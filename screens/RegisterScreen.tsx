// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BasicInfoForm from './Register/BasicInfo';
import IdentityForm from './Register/Identity';
import JobDetailsForm from './Register/Jobdetails';

const steps = ['Basic Info', 'Job Details'];

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm onNext={() => setCurrentStep(1)} />;
      // case 1:
      //   return <IdentityForm onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />;
      case 1:
        return <JobDetailsForm onBack={() => setCurrentStep(1)} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={[styles.step, currentStep === index && styles.activeStep]}>
            <Text style={[styles.stepText, currentStep === index && styles.activeStepText]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
      {renderStep()}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  step: {
    paddingVertical: 6,
  },
  activeStep: {
    borderBottomWidth: 2,
    borderColor: '#c9ba00',
  },
  stepText: {
    fontSize: 16,
    color: '#777',
  },
  activeStepText: {
    fontWeight: 'bold',
    color: '#c9ba00',
  },
});
