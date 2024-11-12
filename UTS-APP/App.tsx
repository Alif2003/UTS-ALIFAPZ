//bismilah

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
      // Create new course
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
      // Update existing course
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
    <SafeAreaView>
      <View style={styles.header_container}>
        <Text style={styles.txt_main}>Course List ({list.length})</Text>
        <TouchableOpacity
          onPress={handleVisibleModal}
          style={styles.btnNewContainer}>
          <Text style={styles.textButton}>New Course</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={visible}>
        <SafeAreaView>
          <View style={styles.form}>
            <TouchableOpacity onPress={handleVisibleModal}>
              <Text style={styles.txtClose}>Close</Text>
            </TouchableOpacity>
            <TextInput
              value={courseName}
              style={styles.text_input}
              placeholder="Course Name"
              onChangeText={setCourseName}
            />
            <TextInput
              value={coursePrice.toString()}
              style={styles.text_input}
              placeholder="Course Price"
              onChangeText={setCoursePrice}
            />
            <TextInput
              value={description}
              style={styles.text_input}
              placeholder="Description"
              onChangeText={setDescription}
            />
            <TextInput
              value={status.toString()}
              style={styles.text_input}
              placeholder="Status"
              onChangeText={setStatus}
            />
            <TouchableOpacity onPress={handleSave} style={styles.btnContainer}>
              <Text style={styles.textButton}>
                {hideId == null ? 'Save' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <ScrollView>
        {list.map((item, index) => (
          <View style={styles.item_course} key={index}>
            <View>
              <Text style={styles.txt_name}>
                {index + 1}. {item.course_name}
              </Text>
              <Text style={styles.txt_item}>{item.description}</Text>
              <Text
                style={
                  item.status === 1 ? styles.txt_enabled : styles.txt_disabled
                }>
                {item.status === 1 ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.txt_del}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.txt_edit}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  form: {padding: 15, marginTop: 10},
  txtClose: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'right',
  },
  text_input: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 10,
  },
  header_container: {
    padding: 15,
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt_main: {fontSize: 22, fontWeight: 'bold'},
  item_course: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt_name: {fontSize: 18, marginTop: 5, fontWeight: 'bold'},
  txt_item: {fontSize: 14, marginTop: 5},
  txt_enabled: {fontSize: 14, marginTop: 5, color: 'green', fontWeight: 'bold'},
  txt_disabled: {fontSize: 14, marginTop: 5, color: 'red', fontWeight: 'bold'},
  txt_del: {fontSize: 14, marginTop: 5, color: 'red', fontWeight: 'bold'},
  txt_edit: {fontSize: 14, marginTop: 5, color: 'blue', fontWeight: 'bold'},
  btnContainer: {padding: 15, backgroundColor: '#000', marginTop: 20},
  btnNewContainer: {padding: 10, backgroundColor: '#000'},
  textButton: {textAlign: 'center', color: '#FFF'},
});
