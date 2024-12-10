import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);

  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const [hideId, setHideId] = useState(null);

  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    axios
      .get('http://10.0.2.2:3000/courses')
      .then(res => {
        setList(res.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  };

  const handleDelete = item => {
    axios
      .delete(`http://10.0.2.2:3000/courses/${item.id}`)
      .then(() => {
        getList();
      })
      .catch(error => {
        console.error('Error deleting course:', error);
      });
  };

  const handleSave = () => {
    const data = {
      course_name: courseName,
      course_price: Number(coursePrice) || 0,
      description: description,
      status: Number(status) || 1,
    };

    if (hideId == null) {
      axios
        .post('http://10.0.2.2:3000/courses', data)
        .then(() => {
          getList();
          resetForm();
        })
        .catch(error => {
          console.error('Error creating course:', error);
        });
    } else {
      axios
        .put(`http://10.0.2.2:3000/courses/${hideId}`, data)
        .then(() => {
          getList();
          resetForm();
        })
        .catch(error => {
          console.error('Error updating course:', error);
        });
    }
  };

  const handleEdit = item => {
    setVisible(true);
    setHideId(item.id);
    setCourseName(item.course_name);
    setCoursePrice(item.course_price.toString());
    setDescription(item.description);
    setStatus(item.status.toString());
  };

  const handleVisibleModal = () => {
    setVisible(!visible);
    setHideId(null);
    resetForm();
  };

  const resetForm = () => {
    setCourseName('');
    setCoursePrice(0);
    setDescription('');
    setStatus(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Course List ({list.length})</Text>
      </View>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              {width: isLandscape ? '70%' : '90%'},
            ]}>
            <TouchableOpacity onPress={handleVisibleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.formContainer}>
              <TextInput
                value={courseName}
                style={styles.textInput}
                placeholder="Course Name"
                onChangeText={setCourseName}
              />
              <TextInput
                value={coursePrice.toString()}
                style={styles.textInput}
                placeholder="Course Price"
                keyboardType="numeric"
                onChangeText={setCoursePrice}
              />
              <TextInput
                value={description}
                style={styles.textInput}
                placeholder="Description"
                onChangeText={setDescription}
                multiline={true}
              />
              <TextInput
                value={status.toString()}
                style={styles.textInput}
                placeholder="Status (1 or 0)"
                keyboardType="numeric"
                onChangeText={setStatus}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>
                  {hideId == null ? 'Save' : 'Update'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{
          flexDirection: isLandscape ? 'row' : 'column',
          flexWrap: 'wrap',
        }}>
        {list.map((item, index) => (
          <View
            style={[styles.courseCard, {width: isLandscape ? '48%' : '90%'}]}
            key={index}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>
                {index + 1}. {item.course_name}
              </Text>
              <Text style={styles.courseDescription}>{item.description}</Text>
              <Text
                style={
                  item.status === 1
                    ? styles.statusEnabled
                    : styles.statusDisabled
                }>
                {item.status === 1 ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleVisibleModal} style={styles.addButton}>
        <Text style={styles.buttonText}>New Course</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  // Existing styles remain unchanged
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  headerContainer: {
    padding: 15,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  headerText: {color: '#fff', fontSize: 22, fontWeight: 'bold'},
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#03dac6',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {backgroundColor: 'white', borderRadius: 10, padding: 20},
  closeButton: {color: '#6200ee', fontWeight: 'bold', textAlign: 'right'},
  formContainer: {paddingVertical: 10},
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  courseInfo: {flex: 1},
  courseTitle: {fontSize: 18, fontWeight: 'bold'},
  courseDescription: {fontSize: 14, color: '#666'},
  statusEnabled: {fontSize: 14, color: 'green', fontWeight: 'bold'},
  statusDisabled: {fontSize: 14, color: 'red', fontWeight: 'bold'},
  actionsContainer: {justifyContent: 'space-around'},
  deleteButton: {color: 'red', fontWeight: 'bold'},
  editButton: {color: 'blue', fontWeight: 'bold'},
});
