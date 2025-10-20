import React from 'react';
import { View } from 'react-native';
import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';

type ConfirmModalProps = {
    visible: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onDismiss: () => void;
};

export default function ConfirmModal({ visible, title, message, confirmLabel = 'Conferma', cancelLabel = 'Annulla', onConfirm, onDismiss }: ConfirmModalProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                {title ? <Dialog.Title>{title}</Dialog.Title> : null}
                {message ? <Dialog.Content><Paragraph>{message}</Paragraph></Dialog.Content> : null}
                <Dialog.Actions>
                    <Button onPress={onDismiss}>{cancelLabel}</Button>
                    <Button mode="contained" onPress={onConfirm}>{confirmLabel}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
