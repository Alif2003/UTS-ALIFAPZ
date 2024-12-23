import {StyleSheet} from 'react-native';

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
    position: 'relative',
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
  actionsContainer: {
    position: 'absolute', // Memastikan posisinya diatur secara mutlak
    top: 11, // Jarak dari atas card
    left: 260, //
    flexDirection: 'column',
    alignItems: 'flex-end', // Menempatkan tombol ke kanan
    marginTop: 10,
  },
  deleteButton: {color: 'red', fontWeight: 'bold', marginBottom: 10},
  editButton: {color: 'blue', fontWeight: 'bold'},
});

export default styles;
