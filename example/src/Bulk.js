import React from 'react';
import {
    Button,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
} from 'react-admin';

const ResetViewsButton = ({ selectedIds }) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
        'posts',
        selectedIds,
        { AutocompleteInput: 'programming' },
        {
            onSuccess: () => {
                refresh();
                notify('Posts updated');
                unselectAll('posts');
            },
            onFailure: error => notify('Error: posts not updated', 'warning'),
        }
    );

    return (
        <Button
            label="Set all AutocompleteInput values to <programming>"
            disabled={loading}
            onClick={updateMany}
        >
        </Button>
    );
};

export default ResetViewsButton;