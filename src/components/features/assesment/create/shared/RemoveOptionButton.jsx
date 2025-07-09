// import { motion } from 'framer-motion'
// import DeleteIcon from '@/assets/trashIcon.svg?react'
// const RemoveOptionButton = ({ handleRemove, canRemove }) => {
//     return (
//         <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleRemove}
//             className="text-greyPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
//             disabled={!canRemove}
//         >
//             <DeleteIcon className="w-4 h-4 text-greyPrimary group-hover:text-dangerPrimary transition-colors duration-300 ease-in" />
//         </motion.button>
//     )
// }

// export default RemoveOptionButton

import { motion } from 'framer-motion'
import DeleteIcon from '@/assets/trashIcon.svg?react'
const RemoveOptionButton = ({ handleRemove, canRemove }) => {
    return (
        <motion.button
            {...(canRemove ? {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
            } : {})}
            onClick={handleRemove}
            className={`text-greyPrimary transition-colors disabled:opacity-50 ${canRemove ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
            disabled={!canRemove}
        >
            <DeleteIcon className={`w-4 h-4 text-greyPrimary group-hover:text-dangerPrimary transition-colors duration-300 ease-in ${canRemove ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            />
        </motion.button>
    )
}

export default RemoveOptionButton