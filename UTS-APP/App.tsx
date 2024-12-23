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
  Alert,
  Animated,
} from 'react-native';
import axios from 'axios';
import styles from './src/style';

const App = () => {
  const [animations, setAnimations] = useState({});

  useEffect(() => {
    if (list.length > 0) {
      const newAnimations = {};
      list.forEach(item => {
        if (!animations[item.id]) {
          newAnimations[item.id] = new Animated.Value(1);
        }
      });
      setAnimations(prevAnimations => ({...prevAnimations, ...newAnimations}));
    }
  }, [list]);

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
    if (!animations[item.id]) {
      console.error(`Animation for item ID ${item.id} is not defined`);
      return;
    }

    // Animasi shake sebelum menghapus
    Animated.sequence([
      Animated.timing(animations[item.id], {
        toValue: 0.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animations[item.id], {
        toValue: -0.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animations[item.id], {
        toValue: 0.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animations[item.id], {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      // Mengecilkan elemen setelah shake
      Animated.timing(animations[item.id], {
        toValue: -1000, // Berpindah jauh keluar layar
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Setelah animasi selesai, hapus item dari server
      axios
        .delete(`http://10.0.2.2:3000/courses/${item.id}`)
        .then(() => {
          getList(); // Perbarui daftar
        })
        .catch(error => {
          console.error('Error deleting course:', error);
        });
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
        <Text style={styles.headerText}>Course List</Text>
      </View>
      <Modal animationType="fade" transparent={true} visible={visible}>
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
              <TouchableOpacity
                onPress={() => {
                  handleVisibleModal();
                  handleSave();
                }}
                style={styles.saveButton}>
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
          <Animated.View
            style={[
              styles.courseCard,
              {width: isLandscape ? '48%' : '90%'},
              {
                transform: [
                  {
                    translateX: animations[item.id] // Hubungkan animasi translateX
                      ? animations[item.id].interpolate({
                          inputRange: [-1, 1],
                          outputRange: [-10, 10],
                        })
                      : 0,
                  },
                ],
              },
            ]}
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
          </Animated.View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleVisibleModal} style={styles.addButton}>
        <Text style={styles.buttonText}>New Course</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
