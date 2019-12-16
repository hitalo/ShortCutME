import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { ListItem, Input, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as uuid from 'uuid/v4';
// import * as FileSystem from 'expo-file-system';

import { DBManager } from '../../database/DBManager';
import ConfirmModal from '../../modals/confirm-modal';

export default class MainList extends Component {

  items = [];

  newItem = { id: '', name: '', url: '' }
  db = new DBManager();
  // importText = "Current items will be overwrited by shortcutme.txt located in \n\n" + FileSystem.documentDirectory + "shortcutme.\n\n Continue?";
  // exportText = "A file named shortcutme.txt will be created in \n\n" + FileSystem.documentDirectory + "shortcutme.\n\n Continue?"

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      allItems: [],
      selectedItem: {},
      newItem: this.newItem,
      isAddItemVisible: false,
      isItemOptionsVisible: false,
      isConfirmMenuVisible: false,
      // isConfirmImportVisible: false,
      // isConfirmExportVisible: false,
      isMenuVisible: false,
      search: ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ changeAddItemVisibility: this.changeAddItemVisibility });
    this.props.navigation.setParams({ changeMenuVisibility: this.changeMenuVisibility });
    this.getItems();
  }

  getItems() {
    this.db.getItems((items) => {
      this.setState({ items, allItems: items });
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "ShortCutME",
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ margin: 5, padding: 5 }}
            onPress={() => {
              navigation.getParam('changeAddItemVisibility')(true);
            }}
          >
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ margin: 5, padding: 5 }}
            onPress={() => {
              navigation.getParam('changeMenuVisibility')(true);
            }}
          >
            <Icon name="more-vert" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ),
    }
  };

  openLink(item) {
    url = item.url;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else alert("can't open url");
    })
  }

  addOrUpdateItem(item) {
    if (this.validateItem(item)) {
      if (!item.id) {
        item.id = uuid.default();
        if (!item.url.startsWith('http')) { item.url = 'http://' + item.url };
      }
      this.db.addOrUpdateItem(item);
      this.changeAddItemVisibility(false);
      this.getItems();
    }
  }

  validateItem(item) {
    if (!item || !item.name || item.name.trim() === "" || !item.url || item.url.trim() === "") {
      alert("Name and URL are required");
      return false;
    }
    return true;
  }

  deleteSelectedItem = async (isOkSelected) => {
    if (isOkSelected) {
      this.db.deleteItem(this.state.selectedItem);
      this.getItems();
    }
    this.changeConfirmMenuVisibility(false);
    this.changeItemOptionsVisibility(false);
  }

  updateSelectedItem() {
    this.setState({ newItem: this.state.selectedItem });
    this.changeItemOptionsVisibility(false);
    this.changeAddItemVisibility(true);
  }

  openItemOtions(item) {
    this.setState({ selectedItem: item });
    this.changeItemOptionsVisibility(true);
  }

  changeAddItemVisibility = (isAddItemVisible) => {
    if (this.state.selectedItem)
      this.setState({ newItem: this.state.selectedItem });

    this.setState({ isAddItemVisible });
  }

  changeItemOptionsVisibility = (isItemOptionsVisible) => {
    if (!isItemOptionsVisible)
      this.setState({ selectedItem: {} });

    this.setState({ isItemOptionsVisible });
  }

  changeConfirmMenuVisibility = (isConfirmMenuVisible) => {
    this.setState({ isConfirmMenuVisible });
  }

  // changeConfirmImportVisibility = (isConfirmImportVisible) => {
  //   this.setState({ isConfirmImportVisible });
  // }

  // changeConfirmExportVisibility = (isConfirmExportVisible) => {
  //   this.setState({ isConfirmExportVisible });
  // }

  changeMenuVisibility = (isMenuVisible) => {
    this.setState({ isMenuVisible });
  }

  updateSearch = search => {

    let items = [{}];

    if (!search) {
      items = this.state.allItems;
    } else {
      items = this.state.allItems.filter(allItems => {
        return allItems.name.toUpperCase().includes(search.toUpperCase());
      });
    }
    this.setState({ search, items });

  };

  // importDatabase = async (isOkSelected) => {
  //   if (isOkSelected) {
  //     await this.db.importDatabase();
  //     this.getItems();
  //   }
  //   this.changeConfirmImportVisibility(false);
  // }

  // exportDatabase = (isOkSelected) => {
  //   if(isOkSelected)
  //     this.db.exportDatabase();

  //   this.changeConfirmExportVisibility(false);
  // }

  openHelp() {
    this.changeMenuVisibility(false);
    this.props.navigation.navigate("Help");
  }

  render() {
    return (
      <View>

        <Modal
          style={{ flex: 1 }}
          visible={this.state.isConfirmMenuVisible}
          transparent={true}
          onRequestClose={() => this.changeConfirmMenuVisibility(false)}>
          <ConfirmModal
            text="Delete this item?"
            title="Confirm delete"
            okClick={this.deleteSelectedItem}
            outside={this.changeConfirmMenuVisibility} />
        </Modal>

        {/* <Modal
          style={{ flex: 1 }}
          visible={this.state.isConfirmImportVisible}
          transparent={true}
          onRequestClose={() => this.changeConfirmImportVisibility(false)}>
          <ConfirmModal
            text={this.importText}
            title="Confirm import"
            okClick={this.importDatabase}
            outside={this.changeConfirmImportVisibility} />
        </Modal>

        <Modal
          style={{ flex: 1 }}
          visible={this.state.isConfirmExportVisible}
          transparent={true}
          onRequestClose={() => this.changeConfirmExportVisibility(false)}>
          <ConfirmModal
            text={this.exportText}
            title="Confirm export"
            okClick={this.exportDatabase}
            outside={this.changeConfirmExportVisibility} />
        </Modal> */}

        <Modal
          visible={this.state.isMenuVisible}
          transparent={true}
          style={{ flex: 1 }}
          onRequestClose={() => this.changeMenuVisibility(false)}>

          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.changeMenuVisibility(false)}>
            <View
              style={styles.darkModal}>
              <TouchableWithoutFeedback>
                <View
                  style={styles.whiteModal}>

                  {/* <TouchableOpacity
                    onPress={() => {
                      this.changeConfirmExportVisibility(true);
                      this.changeMenuVisibility(false);
                    }}
                    style={styles.menuItem}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Export Data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.changeConfirmImportVisibility(true);
                      this.changeMenuVisibility(false);
                    }}
                    style={styles.menuItem}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Import Data</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => this.openHelp()}
                    style={styles.menuItem}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Help</Text>
                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        </Modal>

        <Modal
          visible={this.state.isItemOptionsVisible}
          transparent={true}
          style={{ flex: 1 }}
          onRequestClose={() => this.changeItemOptionsVisibility(false)}>

          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.changeItemOptionsVisibility(false)}>
            <View
              style={styles.darkModal}>
              <TouchableWithoutFeedback>
                <View
                  style={styles.whiteModal}>

                  <TouchableOpacity
                    onPress={() => this.updateSelectedItem()}
                    style={styles.editItemButton}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.changeConfirmMenuVisibility(true)}
                    style={styles.deleteItemButton}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Delete</Text>
                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        </Modal>

        <Modal
          visible={this.state.isAddItemVisible}
          transparent={true}
          style={{ flex: 1 }}
          onRequestClose={() => this.changeAddItemVisibility(false)}>

          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.changeAddItemVisibility(false)}>

            <View
              style={styles.darkModal}>

              <TouchableWithoutFeedback>
                <View
                  style={styles.whiteModal}>

                  <Text>Name</Text>
                  <Input
                    onChangeText={(name) => this.setState({ 'newItem': { ...this.state.newItem, 'name': name } })}
                    value={this.state.newItem.name}
                    autoCorrect={false}
                    multiline={false}
                    autoCapitalize="none"
                  />
                  <Text style={{ marginTop: 10 }}>URL</Text>
                  <View
                    style={{ flexDirection: 'row' }}>

                    {/* <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text >http://</Text>
                    </View> */}
                    <Input
                      onChangeText={(url) => this.setState({ 'newItem': { ...this.state.newItem, 'url': url } })}
                      value={this.state.newItem.url}
                      containerStyle={{ flex: 1 }}
                      multiline={false}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </View>

                  <View
                    style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => this.changeAddItemVisibility(false)}
                      style={styles.cancelItemButton}>
                      <Text style={{ color: 'white', fontSize: 20 }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.addOrUpdateItem(this.state.newItem)}
                      style={styles.addItemButton}>
                      <Text style={{ color: 'white', fontSize: 20 }}>Save</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>
        </Modal>


        <SearchBar
          placeholder="Search items..."
          onChangeText={this.updateSearch}
          value={this.state.search}
          containerStyle={styles.search}
          inputContainerStyle={styles.searchInput}
        />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          {
            this.state.items.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                titleProps={{ numberOfLines: 1 }}
                subtitle={item.url}
                subtitleProps={{ numberOfLines: 1 }}
                bottomDivider
                onPress={() => this.openLink(item)}
                onLongPress={() => this.openItemOtions(item)}
              />
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  darkModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteModal: {
    width: 300,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10
  },
  addItemButton: {
    backgroundColor: 'green',
    flex: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelItemButton: {
    backgroundColor: 'red',
    flex: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  editItemButton: {
    backgroundColor: 'green',
    // flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10
  },
  deleteItemButton: {
    backgroundColor: 'red',
    // flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10
  },
  search: {
    backgroundColor: 'white',
    borderBottomColor: '#ddd'
  },
  searchInput: {
    backgroundColor: 'white',
  },
  scrollView: {
    marginBottom: 50
  },
  menuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'black'
  }
});
