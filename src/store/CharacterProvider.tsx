import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'
import type { Character, LogEntry, CatalogItem, CharacterState } from '@/engine/types'
import { SCHEMA_VERSION } from '@/engine/types'
import { deriveCharacter } from '@/engine/derive'
import { SKILLS } from '@/data/skills'
import { CLASSES } from '@/data/classes'
import { CATALOG } from '@/data/catalog'

const STORAGE_KEY = 'tree:character'

function load(): Character | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Character
    // Future: migrate if parsed.schemaVersion < SCHEMA_VERSION
    return parsed
  } catch {
    return null
  }
}

function save(c: Character): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  } catch {
    // localStorage full or unavailable — fail silently; data is in memory
  }
}

interface CharacterContextValue {
  character: Character | null
  state: CharacterState | null
  isReady: boolean
  createCharacter: (name: string) => void
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => void
  removeLogEntry: (id: string) => void
  saveCustomCatalogItem: (item: CatalogItem) => void
  exportJSON: () => void
  importJSON: (json: string) => boolean
  resetCharacter: () => void
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Bootstrap from localStorage on mount
  useEffect(() => {
    setCharacter(load())
    setIsReady(true)
  }, [])

  // Persist to localStorage whenever character changes
  useEffect(() => {
    if (character) save(character)
  }, [character])

  // Derive CharacterState from log (never stored)
  const state: CharacterState | null = character
    ? deriveCharacter(
        character.name,
        character.log,
        SKILLS,
        CLASSES,
        [...CATALOG, ...character.customCatalog]
      )
    : null

  const createCharacter = useCallback((name: string) => {
    const now = new Date().toISOString()
    const c: Character = {
      schemaVersion: SCHEMA_VERSION,
      name,
      log: [],
      customCatalog: [],
      createdAt: now,
      updatedAt: now,
    }
    setCharacter(c)
  }, [])

  const addLogEntry = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setCharacter((prev) => {
      if (!prev) return prev
      const newEntry: LogEntry = { id: uuid(), ...entry }
      return {
        ...prev,
        log: [...prev.log, newEntry],
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const removeLogEntry = useCallback((id: string) => {
    setCharacter((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        log: prev.log.filter((e) => e.id !== id),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const saveCustomCatalogItem = useCallback((item: CatalogItem) => {
    setCharacter((prev) => {
      if (!prev) return prev
      // Replace existing item with same id, or append
      const existing = prev.customCatalog.findIndex((c) => c.id === item.id)
      const customCatalog =
        existing >= 0
          ? prev.customCatalog.map((c, i) => (i === existing ? item : c))
          : [...prev.customCatalog, item]
      return { ...prev, customCatalog, updatedAt: new Date().toISOString() }
    })
  }, [])

  const exportJSON = useCallback(() => {
    if (!character) return
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tree-${character.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [character])

  const importJSON = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as Character
      // Basic shape validation
      if (!parsed.name || !Array.isArray(parsed.log)) return false
      const imported: Character = {
        schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION,
        name: parsed.name,
        log: parsed.log,
        customCatalog: parsed.customCatalog ?? [],
        createdAt: parsed.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCharacter(imported)
      return true
    } catch {
      return false
    }
  }, [])

  const resetCharacter = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setCharacter(null)
  }, [])

  const value = useMemo<CharacterContextValue>(() => ({
    character,
    state,
    isReady,
    createCharacter,
    addLogEntry,
    removeLogEntry,
    saveCustomCatalogItem,
    exportJSON,
    importJSON,
    resetCharacter,
  }), [character, state, isReady, createCharacter, addLogEntry, removeLogEntry, saveCustomCatalogItem, exportJSON, importJSON, resetCharacter])

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>
}

export function useCharacter(): CharacterContextValue {
  const ctx = useContext(CharacterContext)
  if (!ctx) throw new Error('useCharacter must be used within a CharacterProvider')
  return ctx
}
