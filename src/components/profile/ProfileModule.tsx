import { useCharacter } from '@/store/CharacterProvider'
import ProfileHeader from './ProfileHeader'
import AttributeRadar from './AttributeRadar'
import CredentialWall from './CredentialWall'

export default function ProfileModule() {
  const { state } = useCharacter()
  if (!state) return null

  return (
    <div className="px-4 py-3 space-y-3">
      <ProfileHeader state={state} />
      <AttributeRadar attributes={state.attributes} />
      <CredentialWall credentials={state.credentials} />
    </div>
  )
}
