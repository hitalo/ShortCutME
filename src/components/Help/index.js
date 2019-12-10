import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';

import * as file from './help';


export default class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            isHelpInfoVisible: false
        }
    }

    openHelpInfoModal(item) {
        item.body = item.body.replace(/#{location}/g, FileSystem.documentDirectory);
        this.setState({ title: item.name, body: item.body }, () => this.changeHelpInfoVisibility(true));
    }

    changeHelpInfoVisibility = (isHelpInfoVisible) => {
        this.setState({ isHelpInfoVisible });
    }

    render() {
        return (
            <View>

                <Modal
                    style={styles.helpInfoModal}
                    visible={this.state.isHelpInfoVisible}
                    onRequestClose={() => this.changeHelpInfoVisibility(false)}>

                    <View style={styles.title}>
                        <Text style={styles.titleText}>{this.state.title}</Text>
                    </View>
                    <View style={styles.body}>
                        <Text>{this.state.body}</Text>
                    </View>

                    <View
                        style={styles.buttonsView}>
                        <TouchableOpacity
                            onPress={() => this.changeHelpInfoVisibility(false)}
                            style={styles.closeButton}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>

                {
                    file.help.items.map((item, index) => {
                        return <ListItem
                            key={index}
                            title={item.name}
                            titleProps={{ numberOfLines: 1 }}
                            bottomDivider
                            onPress={() => this.openHelpInfoModal(item)}
                        />
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    helpInfoModal: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderStyle: 'solid',
        borderBottomColor: 'black'
    },
    titleText: {
        fontSize: 30
    },
    body: {
        flex: 1,
        padding: 10
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10
    },
    closeButton: {
        width: 200,
        backgroundColor: 'green',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});